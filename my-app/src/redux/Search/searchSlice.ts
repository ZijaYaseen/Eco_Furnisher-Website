// redux/Search/searchSlice.ts
import { IProduct } from '@/data';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchQuery: string;
  filteredProducts: IProduct[]; // filtered products for search query
  allProducts: IProduct[]; // Default products for search query
  currentPage: number; // Active page number
  itemsPerPage: number; // Products per page
}

const initialState: SearchState = {
  searchQuery: '',
  filteredProducts: [],
  allProducts: [], // Default: empty
  currentPage: 1,
  itemsPerPage: 20, // Default: 20 items per page
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilteredProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.filteredProducts = action.payload;
    },
    setAllProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.allProducts = action.payload; // Set default products
      state.filteredProducts = action.payload; // Initially, filtered products are the same
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
});

export const { setSearchQuery, setFilteredProducts,setAllProducts, setCurrentPage, setItemsPerPage } = searchSlice.actions;
export default searchSlice.reducer;
