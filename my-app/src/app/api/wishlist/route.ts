import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { getToken } from "next-auth/jwt";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

interface SanityReference {
  _type: "reference";
  _ref: string;
}

interface WishlistItem {
  _key: string;
  product: SanityReference; 
}

interface WishlistDocument {
  _id: string;
  _type: "wishlist";
  user?: SanityReference;
  guestId?: string;
  items: WishlistItem[];
}

type WishlistQueryParams = { userId?: string; guestId?: string };

// NEW: Migration function for guest to user
async function mergeGuestWishlistWithUser(userId: string, guestId: string): Promise<void> {
  const guestWishlist = await client.fetch(
    `*[_type == "wishlist" && guestId == $guestId][0]`,
    { guestId }
  ) as WishlistDocument | undefined;
  
  if (!guestWishlist) return;

  const userWishlist = await client.fetch(
    `*[_type == "wishlist" && user._ref == $userId][0]`,
    { userId }
  ) as WishlistDocument | undefined;

  if (userWishlist) {
    // Merge items without duplicates
    const mergedItems = [...userWishlist.items];
    const existingProductIds = new Set(
      userWishlist.items.map(item => item.product._ref)
    );
    
    for (const item of guestWishlist.items) {
      if (!existingProductIds.has(item.product._ref)) {
        mergedItems.push(item);
      }
    }
    
    await client.patch(userWishlist._id)
      .set({ items: mergedItems })
      .commit();
    
    // Delete guest wishlist
    await client.delete(guestWishlist._id);
  } else {
    // Convert guest wishlist to user wishlist
    await client.patch(guestWishlist._id)
      .set({
        user: { _type: "reference", _ref: userId },
        guestId: null
      })
      .commit();
  }
}

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  // 1. Try NextAuth session token
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (session && typeof session === 'object') {
    if ('user' in session && session.user && typeof session.user === 'object' && 'id' in session.user && typeof session.user.id === 'string') {
      return session.user.id;
    }
    if ('sub' in session && typeof session.sub === 'string') {
      return session.sub;
    }
  }
  // 2. Try manual JWT
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (typeof payload._id === 'string') {
        return payload._id;
      }
    } catch {}
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const userId = await getUserIdFromRequest(req);
    let guestId = req.cookies.get("guestId")?.value;

    if (!userId && !guestId) {
      guestId = nanoid();
    }

    // NEW: Migrate guest wishlist to user if needed
    if (userId && guestId) {
      await mergeGuestWishlistWithUser(userId, guestId);
    }

    // Find existing wishlist
    let query = "";
    let queryParams: WishlistQueryParams = {};

    if (userId && typeof userId === 'string') {
      query = `*[_type == "wishlist" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (guestId && typeof guestId === 'string') {
      query = `*[_type == "wishlist" && guestId == $guestId][0]`;
      queryParams = { guestId };
    }

    const wishlist = await client.fetch<WishlistDocument | undefined>(query, queryParams);

    if (wishlist) {
      // Check if product already exists
      const existingItemIndex = wishlist.items.findIndex(item => item.product._ref === productId);
      
      if (existingItemIndex > -1) {
        // Remove from wishlist
        const updatedItems = wishlist.items.filter(
          (_, index) => index !== existingItemIndex
        );
        
        await client.patch(wishlist._id)
          .set({ items: updatedItems })
          .commit();
      } else {
        // Add to wishlist
        await client.patch(wishlist._id)
          .insert('after', 'items[-1]', [{
            _key: nanoid(),
            product: { _type: "reference", _ref: productId }
          }])
          .commit();
      }
    } else {
      // Create new wishlist
      const newWishlist: Omit<WishlistDocument, "_id"> = {
      _type: "wishlist",
      items: [{
        _key: nanoid(),
        product: {
          _type: "reference",
          _ref: productId
        }
      }]
    };

    if (userId) {
      newWishlist.user = {
        _type: "reference",
        _ref: userId
      };
    } else {
      newWishlist.guestId = guestId;
    }

    await client.create(newWishlist);
    
  } 
    const res = NextResponse.json({ success: true });
    if (!userId && guestId) {
      res.cookies.set("guestId", guestId, { 
        path: "/",
        maxAge: 60 * 60 * 24 * 30 // 30 days expiration
      });
    }
    return res;
  } catch (error) {
    console.error("Wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | null = req.cookies.get("guestId")?.value ?? null;

    if (userId && guestId) {
      await mergeGuestWishlistWithUser(userId, guestId);
    }

    let query = "";
    let queryParams: WishlistQueryParams = {};

    if (userId) {
      query = `*[_type == "wishlist" && user._ref == $userId][0]{
        _id,
        items[]{
          _key,
          product->{
            _id,
            slug { current },
            productNameEn,
            productSku,
            "imagePath": productImageSet[0],
            "imageSet": productImageSet,
            rating,
            description,
            shortDescription,
            categoryId,
            CategoryName,
            packingWeight,
            shippingCharge,
            inventory,
            tags,
            seo {
              metaTitle,
              metaDescription,
              metaKeywords
            },
            variants[] {
              vid,
              variantSellPrice,
              variantSugSellPrice,
              variantActualSellPrice,
              discountPercentage,
              colors{ colorName, colorCode },
              variantImage
            }
          }
        }
      }`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "wishlist" && guestId == $guestId][0]{
        _id,
        items[]{
          _key,
          product->{
            _id,
            slug { current },
            productNameEn,
            productSku,
            "imagePath": productImageSet[0],
            "imageSet": productImageSet,
            rating,
            description,
            shortDescription,
            categoryId,
            CategoryName,
            packingWeight,
            shippingCharge,
            inventory,
            tags,
            seo {
              metaTitle,
              metaDescription,
              metaKeywords
            },
            variants[] {
              vid,
              variantSellPrice,
              variantSugSellPrice,
              variantActualSellPrice,
              discountPercentage,
              colors{ colorName, colorCode },
              variantImage
            }
          }
        }
      }`;
      queryParams = { guestId };
    } else {
      return NextResponse.json({ items: [] });
    }

    if (!query) {
      return NextResponse.json({ items: [] });
    }

    const wishlist = await client.fetch<WishlistDocument | undefined>(query, queryParams);
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json() as { productId: string };
    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | null = req.cookies.get("guestId")?.value ?? null;

    let query = "";
    let queryParams: WishlistQueryParams = {};

    if (userId) {
      query = `*[_type == "wishlist" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "wishlist" && guestId == $guestId][0]`;
      queryParams = { guestId };
    } else {
      return NextResponse.json(
        { success: false, error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { success: false, error: "No query for wishlist fetch" },
        { status: 400 }
      );
    }

    const wishlist = await client.fetch<WishlistDocument | undefined>(query, queryParams);

    if (!wishlist) {
      return NextResponse.json(
        { success: false, error: "Wishlist not found" }, 
        { status: 404 }
      );
    }

    const updatedItems = wishlist.items.filter(item => item.product._ref !== productId);
    await client.patch(wishlist._id)
      .set({ items: updatedItems })
      .commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from wishlist" },
      { status: 500 }
    );
  }
}