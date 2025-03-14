import { Products} from "@/data";
import Image from "next/image"

interface TopPicksProps {
    products : Products[]
}

const TopPicks = ({products}:TopPicksProps) => {
  return (
    <div className="flex flex-col justify-between items-center bg-[#FFFFFF] px-6 sm:px-10 py-10">
  <h1 className="font-medium text-2xl sm:text-3xl">Top Picks For You</h1>
  <p className="text-[#9F9F9F] font-medium text-sm sm:text-base text-center max-w-[600px] mt-4">
    Find a bright ideal to suit your taste with Amazon great selection of suspension, floor, and table lights.
  </p>

  {/* Products */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full">
    {products.map((product) => (
        <a
        href={product.amazonLink}
        target="_blank"
        rel="noopener noreferrer"
        key={product._id}
      >
      <div className="flex flex-col items-center border-gray-200 border p-2">
        {/* Image */}
        <Image
          src={product.imagePath || `bg-gray-300`}
          alt="Products"
          width={200}
          height={200}
          priority={false} // Default lazy loading
          className="md:w-[250px] md:h-[250px] w-full object-cover "
        ></Image>
        {/* Title */}
        <p className="pt-4 text-base sm:text-lg font-normal text-center">
          {product.name}
        </p>
      
      </div>
      </a>
    ))}
  </div>

  <a
  href='https://www.amazon.com/s?k=sofa+%2C+chair+%2C+table+%2C+bed&crid=2TORQDMT9H7DE&sprefix=sofa+%2C+chair+%2C+tab%2Caps%2C1120&linkCode=ll2&tag=zijaecommerce-20&linkId=208c3b5564cbfb411cc49f84cffeb225&language=en_US&ref_=as_li_ss_tl'
  target="_blank"
  rel="noopener noreferrer"
  >
  <button className="font-medium text-xl border-b-2 border-black pb-2 md:mt-10 mt-5">
    View More
    </button>
    </a>
</div>
  )
}

export default TopPicks