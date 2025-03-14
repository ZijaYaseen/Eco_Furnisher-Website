import { Products } from '@/data'
import Image from 'next/image'

interface OneProduct {
    product : Products
}

const NewArrivals = ({product}:OneProduct) => {
  return (
        /* home page 4th section */
         <div className="flex flex-col lg:flex-row justify-center gap-4 md:gap-14 items-center bg-[#FFF9E5] py-10 px-6 sm:px-10">
        {/* Image Section */}
    
          <Image src={product.imagePath} 
          width={500} height={500} alt="sofa" 
          className='rounded-md'
          priority
          ></Image>
        
      
        {/* Text and Button Section */}
        <div className="flex flex-col w-full lg:w-[40%] text-center">
          <p className="font-medium text-2xl">New Arrivals</p>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl">{product.name}</h2>
          <a 
          href={product.amazonLink}
          rel='noopener noreferral'
          target='_blank'
          >
          <button className="border mt-[33px] border-black font-normal text-xl w-[50vw] md:w-[40%] lg:w-[18vw] lg:h-[10vh] h-[8vh] shadow-xl">
            Order Now
          </button>
          </a>
        </div>
      </div>
  )
}

export default NewArrivals