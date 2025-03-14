import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

const SearchBar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      alert("Please enter a search term!");
      return;
    }
    // Replace 'your-associate-tag' with your actual Amazon Associate Tag
    const amazonSearchUrl =`https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}&language=en_US&crid=2EVSDG0CU6UMJ&linkCode=ll2&linkId=761dd791f16341f6665551fab62b2b90&sprefix=platform+b%2Caps%2C1250&tag=zijaecommerce-20&ref=as_li_ss_tl`;
    router.push(amazonSearchUrl);
  };

  return (
    <div>
      <div className="block z-50 cursor-pointer">
        {searchOpen ? (
          <MdClose
            size={28}
            className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8"
            onClick={() => setSearchOpen(false)}
          />
        ) : (
          <CiSearch
            size={28}
            className="cursor-pointer w-7 h-7 lg:w-8 lg:h-8"
            onClick={() => setSearchOpen(true)}
          />
        )}
      </div>
      {searchOpen && (
        <div className="fixed z-10 md:top-[72px] top-16 left-4 right-4 md:right-8 md:left-8 max-w-[1440vw]">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="border px-4 py-2 md:py-4 rounded w-full focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 md:px-8 py-2 md:py-3 bg-[#7e6b2f] hover:bg-[#b1a067] text-white rounded"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
