// /app/api/cart/route.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";

// Convert the secret key from the environment variable.
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

// ----------------------------
// Define Interfaces for Cart Data
// ----------------------------
interface CartItemInDocument {
  _key: string;
  product: { _ref: string };
  quantity: number;
  subtotal: number;
}

interface NewCart {
  _type: string;
  items: {
    _key: string;
    product: { _type?: string; _ref: string };
    quantity: number;
    subtotal: number;
  }[];
  // Optional fields for association:
  user?: { _type: string; _ref: string };
  guestId?: string;
}

interface ExistingCart {
  _id: string;
  items: CartItemInDocument[];
  // Optionally stored fields:
  user?: { _type: string; _ref: string };
  guestId?: string;
}

// ----------------------------
// Function to Merge Guest Cart with User Cart
// ----------------------------
async function mergeGuestCartWithUserCart(userId: string, guestId: string): Promise<void> {
  // 1. Fetch the guest cart (if any)
  const guestCartQuery = `*[_type == "cart" && guestId == $guestId][0]`;
  const guestCart = await client.fetch(guestCartQuery, { guestId }) as ExistingCart | undefined;

  // 2. Fetch the user's existing cart (if any)
  const userCartQuery = `*[_type == "cart" && user._ref == $userId][0]`;
  const userCart = await client.fetch(userCartQuery, { userId }) as ExistingCart | undefined;

  if (!guestCart) return; // Agar guest cart nahin hai, to kuch merge karne ki zarurat nahin.

  if (userCart) {
    // Merge items from guest cart into the existing user cart.
    const mergedItems = [...userCart.items];
    for (const guestItem of guestCart.items) {
      // Check if product already exists in user cart.
      const index = mergedItems.findIndex(item => item.product._ref === guestItem.product._ref);
      if (index > -1) {
        // Agar product exists karta hai, quantity add karo.
        mergedItems[index].quantity += guestItem.quantity;
        // Recalculate subtotal. (Yahan assume kiya gaya hai ke product price remains same.)
        const productPrice =
          guestItem.quantity > 0 ? guestItem.subtotal / guestItem.quantity : 0;
        mergedItems[index].subtotal = mergedItems[index].quantity * productPrice;
      } else {
        // Naya item add karo.
        mergedItems.push(guestItem);
      }
    }
    await client.patch(userCart._id).set({ items: mergedItems }).commit();
    // (Optional) Agar aap guest cart document ko delete karna chahte hain, to aap niche wali line uncomment kar sakte hain.
    // await client.delete(guestCart._id);
  } else {
    // Agar user ke paas pehle se cart nahin hai, to guest cart ko user cart bana dein.
    await client
      .patch(guestCart._id)
      .set({
        user: { _type: "reference", _ref: userId },
        guestId: null, // Guest ID ko clear kar sakte hain.
      })
      .commit();
  }
}

// ----------------------------
// POST: Add/Update Cart
// ----------------------------
export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    // 1. Check if the request comes from a logged-in user.
    const token = req.cookies.get("token")?.value;
    let userId: string | null = null;
    let guestId = req.cookies.get("guestId")?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        userId = (payload as { _id: string })._id;
      } catch (err) {
        console.warn("Invalid token, proceeding as guest.", err);
      }
    }

    // If not logged in and no guestId exists, generate one.
    if (!userId && !guestId) {
      guestId = nanoid();
    }

    // 2. If user is logged in but a guestId exists, merge guest cart with user cart.
    if (userId && guestId) {
      await mergeGuestCartWithUserCart(userId, guestId);
    }

    // 3. Fetch the product’s price from Sanity.
    const productQuery = `*[_type == "product" && _id == $productId][0]{ price }`;
    const product = await client.fetch(productQuery, { productId });
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    const productPrice = product.price;

    // 4. Determine which cart to update (user’s cart or guest cart).
    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};

    if (userId) {
      query = `*[_type == "cart" && user._ref == $userId][0]`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "cart" && guestId == $guestId][0]`;
      queryParams = { guestId };
    }

    const existingCart = (await client.fetch(query, queryParams)) as ExistingCart | undefined;

    if (existingCart) {
      // 5. Update existing cart: either update the quantity or add the new item.
      const productIndex = existingCart.items.findIndex(
        (item: CartItemInDocument) => item.product._ref === productId
      );
      const updatedItems = [...existingCart.items];

      if (productIndex > -1) {
        updatedItems[productIndex].quantity += quantity;
        updatedItems[productIndex].subtotal =
          updatedItems[productIndex].quantity * productPrice;
      } else {
        updatedItems.push({
          _key: nanoid(),
          product: { _ref: productId },
          quantity,
          subtotal: quantity * productPrice,
        });
      }

      await client.patch(existingCart._id).set({ items: updatedItems }).commit();
      const res = NextResponse.json({
        success: true,
        message: "Cart updated successfully!",
      });
      if (!userId && guestId) {
        res.cookies.set("guestId", guestId, { path: "/" });
      }
      return res;
    } else {
      // 6. No cart exists—create a new cart document.
      const newCart: NewCart = {
        _type: "cart",
        items: [
          {
            _key: nanoid(),
            product: { _type: "reference", _ref: productId },
            quantity,
            subtotal: quantity * productPrice,
          },
        ],
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

// ----------------------------
// GET: Fetch Cart (Handles Both Logged-in and Guest Users)
// ----------------------------
export async function GET(req: NextRequest) {
  try {
    // 1. Retrieve token and guestId from cookies.
    const token = req.cookies.get("token")?.value;
    const guestId = req.cookies.get("guestId")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        userId = (payload as { _id: string })._id;
      } catch (err) {
        console.warn("Invalid token", err);
      }
    }

    // 2. If user is logged in and a guestId exists, merge the guest cart.
    if (userId && guestId) {
      await mergeGuestCartWithUserCart(userId, guestId);
    }

    // 3. Build query based on whether the user is logged in or is a guest.
    let query = "";
    let queryParams: { userId?: string; guestId?: string } = {};

    if (userId) {
      query = `*[_type == "cart" && user._ref == $userId][0]{
        ...,
        items[]{
          ...,
          product->{
            _id,
            name,
            imagePath,
            price
          }
        }
      }`;
      queryParams = { userId };
    } else if (guestId) {
      query = `*[_type == "cart" && guestId == $guestId][0]{
        ...,
        items[]{
          ...,
          product->{
            _id,
            name,
            imagePath,
            price
          }
        }
      }`;
      queryParams = { guestId };
    } else {
      // Agar koi identifier nahin, to empty cart return karein.
      return NextResponse.json({ success: true, cart: { items: [] } });
    }

    const cart = await client.fetch(query, queryParams);
    return NextResponse.json({
      success: true,
      cart: cart || { items: [] },
    });
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// ----------------------------
// DELETE: Remove Item from Cart
// ----------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing productId" },
        { status: 400 }
      );
    }

    // 1. Determine user identity from token or guestId.
    const token = req.cookies.get("token")?.value;
    let userId: string | null = null;
    const guestId = req.cookies.get("guestId")?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        userId = (payload as { _id: string })._id;
      } catch (err) {
        console.warn("Invalid token, proceeding as guest.", err);
      }
    }

    // 2. Build query based on whether it's a user or guest cart.
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

    // 3. Fetch the existing cart.
    const existingCart = (await client.fetch(query, queryParams)) as ExistingCart | undefined;
    if (!existingCart) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    // 4. Filter out the product to be removed.
    const filteredItems = existingCart.items.filter(
      (item: CartItemInDocument) => item.product._ref !== productId
    );
    await client.patch(existingCart._id).set({ items: filteredItems }).commit();

    return NextResponse.json({
      success: true,
      message: "Product removed from cart successfully!",
    });
  } catch (error) {
    console.error("Cart DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove product from cart" },
      { status: 500 }
    );
  }
}
