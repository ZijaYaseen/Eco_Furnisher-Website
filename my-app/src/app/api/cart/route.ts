// /app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { getToken } from "next-auth/jwt";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

// Updated interfaces
interface CartItemInDocument {
  _key: string;
  product: { _ref: string };
  variantId: string;
  quantity: number;
  subtotal: number;
  discountedPrice: number; 
}

interface NewCart {
  _type: string;
  items: {
    _key: string;
    product: { _type?: string; _ref: string };
    variantId: string;
    quantity: number;
    subtotal: number;
    discountedPrice: number; 
  }[];
  user?: { _type: string; _ref: string };
  guestId?: string;
  grandTotal: number; // ADDED GRAND TOTAL
}

interface ExistingCart {
  _id: string;
  items: CartItemInDocument[];
  user?: { _type: string; _ref: string };
  guestId?: string;
  grandTotal: number; // ADDED GRAND TOTAL
}

// Helper function to calculate grand total
const calculateGrandTotal = (items: CartItemInDocument[]) => {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

// Merge carts function with discountedPrice support
async function mergeGuestCartWithUserCart(userId: string, guestId: string): Promise<void> {
  const guestCartQuery = `*[_type == "cart" && guestId == $guestId][0]`;
  const guestCart = await client.fetch(guestCartQuery, { guestId }) as ExistingCart | undefined;
  if (!guestCart) return;

  const userCartQuery = `*[_type == "cart" && user._ref == $userId][0]`;
  const userCart = await client.fetch(userCartQuery, { userId }) as ExistingCart | undefined;

  if (userCart) {
    const mergedItems = [...userCart.items];
    for (const guestItem of guestCart.items) {
      const index = mergedItems.findIndex(item => 
        item.product._ref === guestItem.product._ref && 
        item.variantId === guestItem.variantId
      );
      if (index > -1) {
        mergedItems[index].quantity += guestItem.quantity;
        mergedItems[index].subtotal = mergedItems[index].quantity * mergedItems[index].discountedPrice;
      } else {
        mergedItems.push(guestItem);
      }
    }
    
    // Calculate new grand total
    const newGrandTotal = calculateGrandTotal(mergedItems);
    
    await client.patch(userCart._id)
      .set({ 
        items: mergedItems,
        grandTotal: newGrandTotal // UPDATE GRAND TOTAL
      })
      .commit();
  } else {
    await client
      .patch(guestCart._id)
      .set({
        user: { _type: "reference", _ref: userId },
        guestId: null,
        // Keep existing grand total
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

// POST Endpoint - Add to cart with variant support
export async function POST(req: NextRequest) {
  try {
    const { productId, variantId, quantity } = await req.json();

    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | undefined = req.cookies.get("guestId")?.value;

    if (userId && guestId) {
      await mergeGuestCartWithUserCart(userId, guestId);
    }

    // Fetch variant-specific price and discount
    const productQuery = `*[_type == "product" && _id == $productId][0]{
      "variant": variants[vid == $variantId][0] {
        variantActualSellPrice,
        discountPercentage
      }
    }`;
    const product = await client.fetch(productQuery, { productId, variantId });
    
    if (!product || !product.variant) {
      return NextResponse.json(
        { success: false, error: "Product variant not found" },
        { status: 404 }
      );
    }
    
    const productPrice = product.variant.variantActualSellPrice;
    const discountPercentage = product.variant.discountPercentage || 0;
    const discountedPrice = productPrice * (1 - discountPercentage / 100);

    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};

    if (userId) {
      query = `*[_type == "cart" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (typeof guestId === 'string') {
      query = `*[_type == "cart" && guestId == $guestId][0]`;
      queryParams = { guestId };
    }

    const existingCart = (await client.fetch(query, queryParams)) as ExistingCart | undefined;

    if (existingCart) {
      const productIndex = existingCart.items.findIndex(
        (item: CartItemInDocument) => 
          item.product._ref === productId && 
          item.variantId === variantId
      );
      
      const updatedItems = [...existingCart.items];

      if (productIndex > -1) {
        const existingDiscountedPrice = updatedItems[productIndex].discountedPrice;
        updatedItems[productIndex].quantity += quantity;
        updatedItems[productIndex].subtotal = updatedItems[productIndex].quantity * existingDiscountedPrice;
      } else {
        updatedItems.push({
          _key: nanoid(),
          product: { _ref: productId },
          variantId,
          quantity,
          subtotal: quantity * discountedPrice,
          discountedPrice
        });
      }

      // CALCULATE NEW GRAND TOTAL
      const newGrandTotal = calculateGrandTotal(updatedItems);
      
      await client.patch(existingCart._id)
        .set({ 
          items: updatedItems,
          grandTotal: newGrandTotal // UPDATE GRAND TOTAL
        })
        .commit();
        
      const res = NextResponse.json({
        success: true,
        message: "Cart updated successfully!",
      });
      if (!userId && guestId) {
        res.cookies.set("guestId", guestId, { path: "/" });
      }
      return res;
    } else {
      const items = [
        {
          _key: nanoid(),
          product: { _type: "reference", _ref: productId },
          variantId,
          quantity,
          subtotal: quantity * discountedPrice,
          discountedPrice
        }
      ];
      
      // CALCULATE INITIAL GRAND TOTAL
      const initialGrandTotal = calculateGrandTotal(items);
      
      const newCart: NewCart = {
        _type: "cart",
        items,
        grandTotal: initialGrandTotal,
      };

      if (userId) {
        newCart.user = { _type: "reference", _ref: userId };
      } else {
        newCart.guestId = guestId;
      }

      const createdCart = await client.create(newCart);
      const res = NextResponse.json({
        success: true,
        message: "Cart created successfully!",
        cart: createdCart,
      });
      if (!userId && guestId) {
        res.cookies.set("guestId", guestId, { path: "/" });
      }
      return res;
    }
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update cart" });
  }
}

// GET Endpoint - Fetch cart with variant images
export async function GET(req: NextRequest) {
  try {
    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | undefined = req.cookies.get("guestId")?.value;

    if (userId && guestId) {
      await mergeGuestCartWithUserCart(userId, guestId);
    }

    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};

    if (userId) {
      query = `
      *[_type == "cart" && user._ref == $userId][0]{
        items[]{
          _key,
          variantId,
          quantity,
          subtotal,
          discountedPrice,
          product->{
            _id,
            productNameEn,
            productSku,
            "imageSet": productImageSet,
            "variants": variants[vid == ^.^.variantId] {
              vid,
              variantActualSellPrice,
              discountPercentage,
              "variantImage": variantImage,
              colors { colorName, colorCode }
            }
          }
        },
        grandTotal
      }`;
      queryParams = { userId };
    } else if (guestId) {
      query = `
      *[_type == "cart" && guestId == $guestId][0]{
        items[]{
          _key,
          variantId,
          quantity,
          subtotal,
          discountedPrice,
          product->{
            _id,
            productNameEn,
            productSku,
            "imageSet": productImageSet,
            "variants": variants[vid == ^.^.variantId] {
              vid,
              variantActualSellPrice,
              discountPercentage,
              "variantImage": variantImage,
              colors { colorName, colorCode }
            }
          }
        },
        grandTotal
      }`;
      queryParams = { guestId };
    } else {
      return NextResponse.json({ 
        success: true, 
        cart: { 
          items: [], 
          grandTotal: 0 
        } 
      });
    }

    const cart = await client.fetch(query, queryParams);
    return NextResponse.json({
      success: true,
      cart: cart || { 
        items: [], 
        grandTotal: 0 
      },
    });
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// DELETE Endpoint - Remove item by key
export async function DELETE(req: NextRequest) {
  try {
    const itemKey = req.nextUrl.searchParams.get("itemKey");
    if (!itemKey) {
      return NextResponse.json(
        { success: false, error: "Missing itemKey" },
        { status: 400 }
      );
    }

    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | undefined = req.cookies.get("guestId")?.value;

    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};
    if (userId) {
      query = `*[_type == "cart" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "cart" && guestId == $guestId][0]`;
      queryParams = { guestId };
    } else {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingCart = (await client.fetch(query, queryParams)) as ExistingCart | undefined;
    if (!existingCart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const filteredItems = existingCart.items.filter(
      (item: CartItemInDocument) => item._key !== itemKey
    );
    
    // CALCULATE NEW GRAND TOTAL
    const newGrandTotal = calculateGrandTotal(filteredItems);
    
    await client.patch(existingCart._id)
      .set({ 
        items: filteredItems,
        grandTotal: newGrandTotal // UPDATE GRAND TOTAL
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: "Item removed from cart successfully!",
    });
  } catch (error) {
    console.error("Cart DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

// PATCH Endpoint - Update quantity with variant support
export async function PATCH(req: NextRequest) {
  try {
    const { itemKey, quantity } = await req.json();
    
    const userId: string | null = await getUserIdFromRequest(req);
    const guestId: string | undefined = req.cookies.get("guestId")?.value;

    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};

    if (userId) {
      query = `*[_type == "cart" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "cart" && guestId == $guestId][0]`;
      queryParams = { guestId };
    } else {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingCart = (await client.fetch(query, queryParams)) as ExistingCart | undefined;
    if (!existingCart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemToUpdate = existingCart.items.find(item => item._key === itemKey);
    if (!itemToUpdate) {
      return NextResponse.json(
        { success: false, error: "Item not found in cart" },
        { status: 404 }
      );
    }

    const updatedItems = existingCart.items.map(item => {
      if (item._key === itemKey) {
        return {
          ...item,
          quantity: quantity,
          subtotal: quantity * item.discountedPrice
        };
      }
      return item;
    });

    // CALCULATE NEW GRAND TOTAL
    const newGrandTotal = calculateGrandTotal(updatedItems);
    
    await client.patch(existingCart._id)
      .set({ 
        items: updatedItems,
        grandTotal: newGrandTotal // UPDATE GRAND TOTAL
      })
      .commit();

    return NextResponse.json({
      success: true,
      message: "Quantity updated successfully!"
    });
  } catch (error) {
    console.error("Cart PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}