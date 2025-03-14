import React from "react";
import { Nav, Help } from "@/data";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col max-w-[1440px] w-full">
      {/* Main Content */}
      <div className="flex flex-wrap justify-between font-poppins pt-16 pb-8 px-7 md:px-16 lg:px-20 gap-10">
        {/* Address Section */}
        <div className="w-full lg:w-auto md:py-10 text-[#9F9F9F] font-normal text-base text-left">
          400 University Drive Suite 200 Coral Gables, <br />
          FL 33134 USA
        </div>

        {/* Links Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <h4 className="text-[#9F9F9F] font-medium text-base mb-4 sm:mb-8 text-left">
            Links
          </h4>
          <ul className="flex flex-col space-y-4 sm:space-y-6 font-medium text-base text-left">
            {Nav.map((items) => (
              <Link href={items.Link} key={items.name}>
                <li className="cursor-pointer">{items.name}</li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Help Section */}
        <div className="flex flex-col w-full sm:w-auto">
          <h4 className="text-[#9F9F9F] font-medium text-base mb-4 sm:mb-8 text-left">
            Help
          </h4>
          <ul className="flex flex-col space-y-4 sm:space-y-6 font-medium text-base text-left">
            {Help.map((items) => (
              <Link href={items.Link} key={items.name}>
                <li className="cursor-pointer">{items.name}</li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col w-full  sm:w-auto">
          <h4 className="text-[#9F9F9F] font-medium text-base mb-1 sm:mb-8 text-left">
            Newsletter
          </h4>
          <form method="POST" className="flex w-full space-y-4 sm:space-y-0">
            {/* Email Input */}
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email Address"
              className="text-left flex-1 border-b border-black placeholder-[#9F9F9F] text-base focus:outline-none md:p-2 mt-4 md:mt-0 sm:text-left"
            />
            {/* Subscribe Button */}
            <button
              type="submit"
              className="sm:w-auto sm:ml-4 border-b-2 border-black text-black text-base font-medium md:p-2 mt-4 sm:mt-0"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Border and Copyright */}
      <div className="w-[95%] sm:w-[85%] mx-auto border-t border-[#D9D9D9] flex justify-start">
        <p className="font-normal text-base text-start p-5">
          2025 EcoFurnish Home Decor Website. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
