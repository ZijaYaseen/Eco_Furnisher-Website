import { IProduct } from '@/data';
import { Dispatch, RootState } from '../store';
import { setAllProducts, setFilteredProducts, setSearchQuery } from './searchSlice';
import { GetProductsData } from '@/sanity/lib/queries';

// Fetch and set all products when app loads
export const fetchAllProducts = () => async (dispatch: Dispatch) => {
  try {
    const products = await GetProductsData(); // Fetch all products
    dispatch(setAllProducts(products));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Perform search and filter products
export const performSearch = (query: string) => (dispatch: Dispatch, getState: () => RootState) => {
  dispatch(setSearchQuery(query)); //  Redux store me query update karna
  const { allProducts } = getState().search; // Get default products
  const filtered = allProducts.filter((product: IProduct) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  dispatch(setFilteredProducts(filtered));
};

// for pagination
export const selectPaginatedProducts = (state: RootState) => {
  const { currentPage, itemsPerPage, filteredProducts } = state.search;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
};


