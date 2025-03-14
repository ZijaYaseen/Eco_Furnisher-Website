"use client"

import React from 'react';
import { UseAppSelector, UseAppDispatch } from '@/redux/hooks';
import { setCurrentPage } from '@/redux/Search/searchSlice';

const Pagination = () => {
  const dispatch = UseAppDispatch();
  const { currentPage, itemsPerPage, filteredProducts } = UseAppSelector((state) => state.search);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  return (
    <div className="flex items-center justify-center gap-[20px] my-10">
      <button
        className={`px-4 py-2 rounded-[10px] ${currentPage === 1 ? 'cursor-not-allowed bg-[#FFF9E5]' : 'hover:bg-[#FBEBB5] bg-[#FFF9E5]'}`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-4 py-2 rounded-[10px] ${currentPage === i + 1 ? 'bg-[#FBEBB5]' : 'bg-[#FFF9E5]'}`}
          onClick={() => handlePageClick(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`px-4 py-2 rounded-[10px] ${currentPage === totalPages ? 'cursor-not-allowed bg-[#FFF9E5]' : 'hover:bg-[#FBEBB5] bg-[#FFF9E5]'}`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
