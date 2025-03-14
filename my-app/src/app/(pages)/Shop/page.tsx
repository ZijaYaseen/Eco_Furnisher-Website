"use client";

import dynamic from 'next/dynamic';
import { UseAppSelector } from "@/redux/hooks";
import { LiaSlidersHSolid } from "react-icons/lia";
import { BsFillGridFill } from "react-icons/bs";
import { PiLineVertical } from "react-icons/pi";
import { CiGrid31 } from "react-icons/ci";

const PagesHeader = dynamic(() => import('@/components/PagesHeader'));
const ProductsList = dynamic(() => import('@/components/ProductsList'));
const Pagination = dynamic(() => import('@/components/Pagination'));

const Shop = () => {
  const { itemsPerPage, filteredProducts, currentPage, searchQuery } = UseAppSelector((state) => state.search);
  
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className='max-w-[1440px] font-poppins w-full md:mt-[90px] mt-[60px]'>
      {/* Header */}
      <PagesHeader title='Shop' name='Shop' />

      {/* Filter and Sort Section */}
      <div className='bg-[#FAF4F4] md:h-[100px] mt-10 px-10 py-3 md:py-0 flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex items-center space-x-3'>
          <LiaSlidersHSolid size={25} />
          <h4 className='font-normal text-xl'>Filter</h4>
          <BsFillGridFill size={17} />
          <CiGrid31 size={24} />
          <PiLineVertical color='black' size={50} className='text-[#000000]' />
          <p className='font-normal md:text-base text-xs'>
            Showing {startIndex}&#8211;{endIndex} of {filteredProducts.length} results
          </p>
        </div>

        <div className='flex items-center space-x-6'>
          <div className='flex items-center md:gap-4 gap-2'>
            <h4 className='font-normal md:text-xl text-sm'>Show</h4>
            <p className='flex w-[55px] h-[40px] md:h-[55px] text-[#9F9F9F] text-base font-normal bg-slate-50 justify-center items-center'>
              {endIndex}
            </p>
          </div>
          <div className='flex items-center md:gap-4 gap-2'>
            <h4 className='font-normal md:text-xl text-sm'>Sort by</h4>
            <p className='flex md:w-[188px] w-[100px] h-[40px] md:h-[55px] text-[#9F9F9F] text-base bg-slate-50 font-normal justify-center items-center'>
              {searchQuery || "Default"}
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <ProductsList />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default Shop;
