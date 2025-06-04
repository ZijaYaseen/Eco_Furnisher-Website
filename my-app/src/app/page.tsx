// app/page.tsx

import HeroSection from '@/components/HeroSection';
import { BestSellerSanity } from '@/sanity/lib/queries';
import FeaturedSection from '@/components/FeaturedSection';
import TopPicks from '@/components/TopPicks';
import CollectionsSection from '@/components/Collection';
import BestSellerSection from '@/components/BestSeller';
import BlogSection from '@/components/Blog';


const Home = async () => {

  const BestSellerData = await BestSellerSanity();



  return (
    <div className='max-w-[1440px] mx-auto font-poppins h-full w-full overflow-hidden mt-[56px]'>

     {/* Home PageSection 1*/}
     <HeroSection />

     <BestSellerSection products={BestSellerData}/>

    {/* Home Page 2nd section  Featured section*/}
    <FeaturedSection  />

    <CollectionsSection />

    {/* Home page 3rd section */}
    <TopPicks products={BestSellerData}/>


{/* Home page 4th section */}
<BlogSection />


{/* Home pae 5th section */}

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