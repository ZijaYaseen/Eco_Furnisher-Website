// src/redux/wishlistSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    try {
      const response = await axios.get('/api/wishlist');
      return response.data.items || [];
    } catch (error) {
      throw error || 'Failed to fetch wishlist';
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleItem',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/wishlist', { productId });
      return { productId, inWishlist: response.data.inWishlist };
    } catch (error) {
      return rejectWithValue(error || 'Failed to update wishlist');
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  'wishlist/removeItem',
  async (productId: string, { rejectWithValue }) => {
    try {
      await axios.delete('/api/wishlist', { data: { productId } });
      return productId;
    } catch (error) {
      return rejectWithValue(error || 'Failed to remove item');
    }
  }
);

interface WishlistState {
  items: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  status: 'idle',
  error: null
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load wishlist';
      })
      
      // Toggle Item
      .addCase(toggleWishlistItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const { productId, inWishlist } = action.payload;
        
        if (inWishlist) {
          // Add item
          state.items.push({
            _key: `temp-${Date.now()}`,
            product: { _id: productId }
          });
        } else {
          // Remove item
          state.items = state.items.filter(item => 
            item.product?._id !== productId
          );
        }
        state.status = 'succeeded';
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Remove Item
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => item.product?._id !== action.payload
        );
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;