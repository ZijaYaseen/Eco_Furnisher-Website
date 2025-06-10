// cartSlice.ts
import { CartItem } from '@/data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: CartItem[];
  grandTotal: number; // ADDED GRAND TOTAL
}

const initialState: CartState = {
  items: [],
  grandTotal: 0, // INITIAL VALUE
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const itemKey = `${newItem.product._id}-${newItem.variantId}`;
      
      const existing = state.items.find(item => item._key === itemKey);
      
      if (existing) {
        existing.quantity += newItem.quantity;
        // REMOVED FRONTEND PRICE CALCULATION
        // We'll rely on backend-calculated subtotal
      } else {
        state.items.push({ ...newItem, _key: itemKey });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._key !== action.payload);
    },
    clearCart: state => {
      state.items = [];
      state.grandTotal = 0; // RESET TOTAL
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    // ADDED ACTION TO SET GRAND TOTAL
    setGrandTotal: (state, action: PayloadAction<number>) => {
      state.grandTotal = action.payload;
    },
    // ADDED ACTION TO SET FULL CART STATE
    setCartData: (state, action: PayloadAction<{items: CartItem[], grandTotal: number}>) => {
      state.items = action.payload.items;
      state.grandTotal = action.payload.grandTotal;
    },
    updateQuantity: (state, action: PayloadAction<{
  key: string;
  quantity: number;
  subtotal: number; // ADD SUBTOTAL HERE
}>) => {
  const { key, quantity, subtotal } = action.payload;
  const item = state.items.find(item => item._key === key);
  if (item) {
    item.quantity = quantity;
    item.subtotal = subtotal; // UPDATE SUBTOTAL
  }
  
  // RECALCULATE GRAND TOTAL
  state.grandTotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
},
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  clearCart, 
  setCartItems, 
  updateQuantity,
  setGrandTotal, // EXPORT NEW ACTION
  setCartData    // EXPORT NEW ACTION
} = cartSlice.actions;

export default cartSlice.reducer;