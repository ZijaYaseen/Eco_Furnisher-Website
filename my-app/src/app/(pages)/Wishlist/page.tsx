// src/app/wishlist/page.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import PagesHeader from "@/components/PagesHeader";
import ProductCard from "@/components/ProductCard";
import { 
  fetchWishlist, 
  removeWishlistItem
} from '@/redux/wishlistSlice';

import { 
  Dispatch, 
  RootState 
} from '@/redux/store';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function WishlistPage() {
  const dispatch = useDispatch<Dispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.wishlist);
  console.log(items, "items");

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeWishlistItem(productId));
  };

  return (
    <div className="w-full mt-12 md:mt-24 font-poppins max-w-[1440px] mx-auto">
      <PagesHeader name="Wishlist" title="Your Wishlist" />
      <div className="container mx-auto px-4 py-8">
        {status === 'loading' && (
          <LoadingSpinner text="Loading wishlist..." />
        )}

        {status === 'succeeded' && items.length === 0 && (
          <div className="text-center py-12">
            <FaHeartBroken className="mx-auto text-gray-300 text-5xl mb-4" />
            <p className="text-xl text-gray-500">Your wishlist is empty</p>
            <p className="text-gray-400 mt-2">
              Start adding items you love by clicking the heart icon
            </p>
          </div>
        )}

        {status === 'succeeded' && items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {items  // Only render items with full product data
              .map((item) => (
                <div key={item._key} className="relative">
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full shadow-md hover:bg-red-100 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <FaHeart className="text-gray-700" />
                  </button>
                  <ProductCard product={item.product} />
                </div>
              ))
            }
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-12">
            <p className="text-red-500">
              {error || 'Failed to load wishlist items'}
            </p>
            <button 
              onClick={() => dispatch(fetchWishlist())}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}