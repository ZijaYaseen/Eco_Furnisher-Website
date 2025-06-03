import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightSLine } from 'react-icons/ri';

const PagesHeader = (props: { name: string; title: string }) => {
  return (
    <div className="relative flex flex-col text-white items-center justify-center lg:h-[318px] h-[150px] px-4 bg-gray-600">
      {/* Background Image using Next/Image with priority */}
      <Image
        src="/best-seller-home.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      {/* Content Overlay */}
      <div className="relative flex flex-col items-center">
        <Image
          src="/Logo.svg"
          alt="logo"
          width={60}
          height={50}
          priority
          className="w-[40px] h-[40px] md:w-[60px] md:h-[50px]"
        />
        <h1 className="font-medium text-3xl md:text-7xl">{props.title}</h1>
        <div className="flex space-x-2 py-2 text-sm sm:text-lg items-center">
          <Link href="/">
            <h1 className="font-medium">Home</h1>
          </Link>
          <RiArrowRightSLine size={24} />
          <h1 className="font-light">{props.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default PagesHeader;
