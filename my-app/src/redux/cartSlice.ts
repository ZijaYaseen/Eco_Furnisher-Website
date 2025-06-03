// redux/cartSlice.ts
import { CartItem } from '@/data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


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
