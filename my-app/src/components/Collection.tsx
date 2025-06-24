"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Swiper as SwiperCore } from "swiper";

interface CollectionItem {
  title: string;
  image: string;
  link: string;
}

const CollectionsSection = () => {
    const swiperRef = useRef<SwiperCore | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const collections: CollectionItem[] = [
    {
      title: "Vanity Tables & Mirrors",
      image: "/collection1.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Home Decor & Accessories",
      image: "/collection2.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Living Room Furniture",
      image: "/collection3.jpg",
      link: "/collections/living-room-furniture",
    },
    {
      title: "Dining Room Furniture",
      image: "/collection4.jpg",
      link: "/collections/dining-room-furniture",
    },
    {
      title: "Home Office Furniture",
      image: "/collection5.jpg",
      link: "/collections/home-office-furniture",
    },
    {
      title: "Kitchen Furniture",
      image: "/collection6.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Kids & Teen Furniture",
      image: "/collection7.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Office & Study Furniture",
      image: "/collection8.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Outdoor & Patio Furniture",
      image: "/collection9.jpg",
      link: "/collections/vanity-tables",
    },
    {
      title: "Bedroom Furniture",
      image: "/collection10.jpg",
      link: "/collections/bedroom-furniture",
    },
    {
      title: "Smart Storage",
      image: "/collection11.jpg",
      link: "/collections/vanity-tables",
    },
  ];

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <section className="mx-auto max-w-screen-xl py-12 px-4 lg:px-8 relative">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
          Explore Latest Collections
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover your perfect fit
        </p>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="relative"
      >
        {collections.map((item, idx) => (
          <SwiperSlide key={idx}>
            {/* Added group class to enable group-hover on child elements */}
            <Link
              href={item.link}
              className="group relative block overflow-hidden shadow hover:shadow-lg"
            >
              {/* Image Wrapper */}
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title Overlay at the bottom */}
              <div className="absolute bottom-2 left-2 right-2 w-auto bg-white hover:bg-black bg-opacity-60 text-black hover:text-white text-center text-sm sm:text-base font-medium p-2">
                {item.title}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {!isBeginning && (
        <button
          onClick={handlePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow"
        >
          <FaChevronLeft size={20} />
        </button>
      )}
      {!isEnd && (
        <button
          onClick={handleNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white text-black rounded-full p-2 shadow"
        >
          <FaChevronRight size={20} />
        </button>
      )}

      <div className="text-center mt-8">
        <Link
          href="/collections"
          className="inline-block rounded-md border-black border px-6 py-3 text-black font-semibold hover:bg-gray-800"
        >
          View All Collections
        </Link>
      </div>
    </section>
  );
};

export default CollectionsSection;
