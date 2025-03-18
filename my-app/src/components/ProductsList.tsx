"use client"

import React, { useEffect, useState } from 'react';
import { UseAppSelector, UseAppDispatch } from '@/redux/hooks';
import { fetchAllProducts, selectPaginatedProducts } from '@/redux/Search/searchActions';
import { Product } from '@/data';
import ProductCard from './ProductCard';

const ProductsList: React.FC = () => {
  const paginatedProducts: Product[] = UseAppSelector(selectPaginatedProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = UseAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any previous error
        if (paginatedProducts.length === 0) {
          await dispatch(fetchAllProducts());
        }
      } catch (err) {
        console.log("Err" + err);
        
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch, paginatedProducts.length]);

  if (loading) {
    return (
      <div>
        <h1 className="flex justify-center items-center h-[300px] mt-14 font-bold text-2xl">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[300px] mt-14 font-bold text-2xl text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 py-4 place-items-center px-6 md:px-16 lg:px-10 gap-2">
      {paginatedProducts.map((product) => (
        <div>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
