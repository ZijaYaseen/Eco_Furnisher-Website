'use client';

import React from 'react';
import Image from 'next/image';
import PagesHeader from '@/components/PagesHeader';

const AboutPage = () => {
  return (
    <div className='max-w-screen-2xl mx-auto md:mt-[90px] mt-[60px] font-poppins'>
      <PagesHeader name="About Us" title="About EcoFurnish" />
      
      {/* About Section */}
      <section className='bg-[#f9f9f9] py-12 px-5'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-[#333] mb-4'>Welcome to EcoFurnish</h2>
          <p className='text-lg text-[#555] mb-6 max-w-3xl mx-auto'>
            At EcoFurnish, we believe that furniture should not only be beautiful and functional but also kind to our planet. We specialize in creating sustainable, eco-friendly furniture that enhances your living space while being gentle on the environment. From stylish tables and chairs to cozy beds, our products are designed to inspire and support your eco-conscious lifestyle.
          </p>
        </div>

        <div className='grid md:grid-cols-3 grid-cols-1 justify-center gap-10 md:px-10'>
          <div className='w-full '>
            <Image 
              src="/shop1.svg" 
              alt="Eco-friendly Furniture"
              width={400}
              height={250}
              className="rounded-lg shadow-lg w-[500px] h-[350px]"
            />
          </div>
          <div className='w-full'>
            <Image 
              src="/shop2.svg" 
              alt="Sustainable Furniture"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-[500px] h-[350px]"
            />
          </div>
          <div className='w-full'>
            <Image 
              src="/shop6.svg"
              alt="Comfortable Bed"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-[500px] h-[350px]"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className='py-12 px-5'>
        <div className='text-center'>
          <h2 className='text-3xl font-semibold text-[#333] mb-4'>Our Mission</h2>
          <p className='text-lg text-[#555] max-w-2xl mx-auto'>
            Our mission is simple: to provide our customers with high-quality, eco-friendly furniture that does not compromise on style or comfort. We work with sustainable materials, ethical practices, and a commitment to creating furniture that lasts. With EcoFurnish, you can furnish your home beautifully while supporting a cleaner, greener planet.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className='bg-[#fff9e5] py-12'>
        <div className='text-center'>
          <h2 className='text-3xl font-semibold text-[#333] mb-10'>Why Choose EcoFurnish?</h2>
          <div className=' gap-8 grid grid-cols-1 md:grid-cols-3 px-5'>
            <div className='w-full'>
              <h3 className='font-semibold text-xl text-[#333]'>Eco-Friendly Materials</h3>
              <p className='text-lg text-[#555]'>
                We use only sustainable and eco-friendly materials, ensuring that your furniture has a minimal impact on the environment.
              </p>
            </div>
            <div className='w-full'>
              <h3 className='font-semibold text-xl text-[#333]'>Durability & Quality</h3>
              <p className='text-lg text-[#555]'>
                Our furniture is built to last, offering you long-term value while maintaining aesthetic beauty.
              </p>
            </div>
            <div className='w-full'>
              <h3 className='font-semibold text-xl text-[#333]'>Affordable Luxury</h3>
              <p className='text-lg text-[#555]'>
                We believe in making sustainable furniture accessible, so you don’t have to compromise on style or price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className='py-12 text-center px-5'>
        <p className='text-lg text-[#555]'>
          Join the movement towards a greener, more sustainable world by choosing EcoFurnish. <br />
          Your home, your planet, your future. <br />
          <span className='text-[#B88E2F] font-semibold'>Together, we can make a difference!</span>
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
