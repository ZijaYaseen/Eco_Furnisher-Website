import React from 'react'

const SubFooter = () => {
  return (
    <div className='flex flex-col md:flex-row items-center md:justify-between justify-center py-7 bg-[#FAF4F4] md:h-[300px] md:px-28 px-5 md:gap-20 gap-7'>

          <div className='flex flex-col'>
            <h2 className='font-medium md:text-[32px] text-xl leading-10'>Free Delivery</h2>
            <p className='text-[#9F9F9F] font-normal md:text-xl text-base'>For all oders over $50, consectetur adipim scing elit.</p>
          </div>

          <div>
            <h2 className='font-medium md:text-[32px] text-xl leading-10'>90 Days Return</h2>
            <p className='text-[#9F9F9F] font-normal md:text-xl text-base'>If goods have problems, consectetur adipim scing elit.</p>
          </div>

          <div>
            <h2 className='font-medium md:text-[32px] text-xl leading-10'>Secure Payment</h2>
            <p className='text-[#9F9F9F] font-normal md:text-xl text-base'>100% secure payment, consectetur adipim scing elit.</p>
          </div>

        </div>
  )
}

export default SubFooter