import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { performSearch } from "@/redux/Search/searchActions";
import { UseAppDispatch } from "@/redux/hooks";

const SearchBar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = UseAppDispatch();
  const router = useRouter();
  console.log(router);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      alert("Please enter a search term!");
      return;
    }
    dispatch(performSearch(searchTerm));
    router.push("/Shop"); // Redirect user to the Shop page
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
        <div className="fixed z-10 md:top-[86px] top-[68px] left-4 right-4 md:right-8 md:left-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search products..."
              className="border px-4 py-2 md:py-3 rounded w-full focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 md:px-8 py-2 md:py-3 bg-black hover:bg-[#3b3b3b] text-white rounded"
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
