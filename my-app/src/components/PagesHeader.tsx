import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightSLine } from 'react-icons/ri';

const PagesHeader = (props: { name: string; title: string }) => {
  return (
    <div className="relative flex flex-col items-center justify-center lg:h-[318px] h-[150px] px-4 bg-gray-100">
      {/* Background Image using Next/Image with priority */}
      <Image
        src="/Rectangle1.svg"
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
        <h1 className="font-medium text-3xl md:text-5xl">{props.title}</h1>
        <div className="flex space-x-2 py-1 text-sm sm:text-base">
          <Link href="/">
            <h1 className="font-medium">Home</h1>
          </Link>
          <RiArrowRightSLine size={20} />
          <h1 className="font-light">{props.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default PagesHeader;
