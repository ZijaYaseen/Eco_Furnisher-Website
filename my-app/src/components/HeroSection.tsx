"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <main className="w-full font-poppins max-w-[1440px] mx-auto bg-[url('/Home-Section.jpg')] bg-cover">
        {/* HERO SECTION with Video Background */}
        <section className="relative w-full h-screen flex items-center  overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/12278994-uhd_3840_2160_24fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
           <div className="relative z-10 text-white px-6 md:px-12 lg:px-40 max-w-5xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium md:font-semibold mb-6 leading-tight md:leading-[1.2]">
            Design Your Dream Space with Modern Decor and Thoughtful Furniture
          </h2>

           <Link 
            href="/Shop"
            className="bg-white text-black px-6 py-3 md:px-8 md:py-3 rounded-sm font-medium text-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 inline-block"
          >
            Explore Now
          </Link>
          </div>
        </section>
      </main>
    </>
  );
}
