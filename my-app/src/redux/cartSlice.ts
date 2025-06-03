// redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Product type matching Sanity schema
interface Product {
  _id: string;
  productNameEn: string;
  productSku: string;
  imageSet: string[];
  categoryId: string;
  CategoryName: string[];
  packingWeight: number;
  shortDescription: string;
  description: string;
  rating: number;
  inventory: number;
  tags: string[];
  slug: { current: string };
  variants: {
    vid: string;
    variantSellPrice: number;
    variantSugSellPrice: number;
    variantactualSellPrice: number;
    discountPercentage: number;
  };
}

// CartItem type matching Sanity cartItem object
export interface CartItem {
  _key: string;
  product: Product;
  quantity: number;
  subtotal: number;
  discountedPrice : number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existing = state.items.find(
        item => item.product._id === newItem.product._id
      );
      if (existing) {
        existing.quantity += newItem.quantity;
        existing.subtotal =
          existing.quantity * existing.product.variants.variantactualSellPrice;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.product._id !== action.payload
      );
    },
    clearCart: state => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    updateQuantity: (state, action: PayloadAction<{
      id: string;
      quantity: number;
      discountedPrice: number;
    }>) => {
      const item = state.items.find(item => item.product._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = action.payload.quantity * action.payload.discountedPrice;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
