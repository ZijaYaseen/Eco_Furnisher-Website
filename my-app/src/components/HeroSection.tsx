"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      <main className="w-full font-poppins max-w-[1440px] mx-auto">
        {/* HERO SECTION with Video Background */}
        <section className="relative w-full md:h-[100vh] h-[80vh]  flex items-center justify-center overflow-hidden">
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
          <div className="relative z-10 text-center text-white px-3 font-serif md:max-w-3xl">
            <h2 className="text-xl md:text-5xl md:font-semibold font-medium md:tracking-wider mb-6 ">
              Design Your Dream Space with Modern Decor and Thoughtful Furniture
            </h2>

            <Link href={"/Shop"} className="bg-white text-black px-6 py-2 transition duration-300">
              Explore Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
