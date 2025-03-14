// app/page.tsx

import Image from 'next/image'
import Link from 'next/link'
import { blog } from '@/data/index'
import { FaRegClock } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { FeaturedSectionData, HeroSectionData, NewArrivalsSanity, TopPicksData } from '@/sanity/lib/queries';
import FeaturedSection from '@/components/FeaturedSection';
import TopPicks from '@/components/TopPicks';
import NewArrivals from '@/components/NewArrivals';
import CollectionsSection from '@/components/Collection';


const Home = async () => {

const HeroSectionProductData = await HeroSectionData();

const FeaturedSectionProductData = await FeaturedSectionData();

const TopPicksProductData = await TopPicksData();

const NewArrivalsData = await NewArrivalsSanity()



  return (
    <div className='max-w-[1920px] font-poppins h-full w-full overflow-hidden'>

     {/* Home 1 Section Rocket Single Seater sofa*/}
     {/* <HeroSection product={HeroSectionProductData}  /> */}
     <HeroSection />
     <CollectionsSection />

    {/* Home Page 2nd section  Featured section*/}
    <FeaturedSection products={FeaturedSectionProductData} />

    {/* Home page 3rd section */}
    <TopPicks products={TopPicksProductData}/>

     {/* Home Page 4th Section */}
     <NewArrivals product={NewArrivalsData[0]}/>




{/* Home page 5th section */}
<section className="flex flex-col items-center justify-center bg-[#FFFFFF] py-10">
  <h1 className="font-medium text-3xl sm:text-4xl">Our Blogs</h1>
  <p className="text-[#9F9F9F] font-medium text-base mt-[13px] text-center sm:text-lg px-2">
    Find a bright ideal to suit your taste with our great selection
  </p>

  <div className="flex flex-wrap justify-center items-center w-full gap-10 mt-8">
    {blog.map((items, index) => (
      <div
        key={index}
        className="flex flex-col items-center justify-center mb-8 w-full sm:w-[45%] md:w-[30%] lg:w-[22%]"
      >
        
        <Image
          src={items.image}
          alt="blog"
          width={80}
          height={100}
          priority={false} // Default lazy loading
          className="md:w-full w-[90%] h-[50vh] object-cover rounded-lg"
        ></Image>
        <p className="py-4 text-xl font-normal text-center">{items.title}</p>
        <button className="text-base font-bold border-b-2 border-black">Read More</button>

        <div className="flex items-center space-x-4 mt-6">
          <div className="flex items-center space-x-2">
            <FaRegClock size={18} className="font-bold" />
            <span>5 min</span>
          </div>

          <div className="flex items-center space-x-2">
            <CiCalendar size={24} className="font-bold" />
            <span>
              12<sup>th</sup> Oct 2022
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>

  <Link href={"/Blog"}>
  <button className="font-medium text-xl border-b-2 border-black pb-2">
    View All Post
    </button>
    </Link>
</section>


{/* Home pae 6th section */}

<section className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-16 sm:py-32 bg-[url('/bgHome.svg')] bg-cover bg-center">
  <h1 className="font-bold text-4xl sm:text-6xl text-center">Our Instagram</h1>
  <p className="font-normal text-lg sm:text-xl text-center">Follow our store on Instagram</p>
  <a
  href='https://www.instagram.com/ecof.urnish?igsh=MW1kYWtudXlxeXJvbA=='
    rel='noopener noreferral'
    target='_blank'
    className="font-normal text-lg sm:text-xl bg-[#FAF4F4] rounded-3xl shadow-2xl w-[60%] sm:w-[15vw] h-[10vh] flex items-center justify-center"
  >

     <button
     className="text-lg sm:text-xl cursor-pointer">
      Follow Us

      </button>
    </a>
  
</section>
  
    </div>
  )
}

export default Home