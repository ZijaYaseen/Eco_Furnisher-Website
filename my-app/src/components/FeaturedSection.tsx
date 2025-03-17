import Image from "next/image";

const FeaturedProducts = [
  {
    id: 1,
    name: "Sofa",
    amazonLink: "https://www.amazon.com/stores/page/E95CE77E-D28D-4C9A-90F4-3AEF9F27B592?ingress=0&visitId=fdfd27a5-1f75-4ef3-b4dd-b994cb8fe275&lp_query=sofa&lp_slot=desktop-hsa-3psl&store_ref=SB_A008093732GTOJLF78BQ4-A02679383MWY5T37CU4EW&linkCode=ll2&tag=zijaecommerce-20&linkId=1788d4a4d27b84e825b4f7efb017badd&language=en_US&ref_=as_li_ss_tl",
    imagePath: "/Fsofa.jpg",
  },
  {
    id: 2,
    name: "Wardrobe",
    amazonLink: "https://www.amazon.com/stores/page/F4362F64-2D24-419A-B296-708B9568DBC4?ingress=0&visitId=d9dde809-2a74-4e39-b3a6-fc31d32dba89&lp_query=wardrobe&lp_slot=desktop-hsa-3psl&store_ref=SB_A03094502JWEM6Y61UI08-A06665163405IOG0MX0KA&linkCode=ll2&tag=zijaecommerce-20&linkId=eabcc36824fbb9d77b7774941f50f6eb&language=en_US&ref_=as_li_ss_tl", 
    imagePath: "/Fwardrobe.jpg",
  },
  {
    id: 3,
    name: "Chairs",
    amazonLink: "https://www.amazon.com/stores/page/81531D7A-8E16-456C-9EB5-2843D34EE048?ingress=0&visitId=3c780d7a-23a2-4338-b7f7-f7fa8697e360&lp_query=chairs&lp_slot=desktop-hsa-3psl&store_ref=SB_A0173331B70RTULK1EH9-A05774091KMCKAFHLZUEW&linkCode=ll2&tag=zijaecommerce-20&linkId=239936a2ccc1e3d4393f5bf135774868&language=en_US&ref_=as_li_ss_tl", 
    imagePath: "/Fchairs.jpg",
  },
  {
    id: 4,
    name: "Bed Sheets",
    amazonLink: "https://www.amazon.com/stores/page/0F87FA15-B939-4A2B-800A-4CE0A17224CF?_encoding=UTF8&store_ref=SB_A09448333MI4AD8MOKN57-A072295112BETT943M3ND&pd_rd_plhdr=t&aaxitk=6d80f293a1198c886183b183be10e230&hsa_cr_id=0&lp_asins=B095SQKWZP%2CB095SRVBYB%2CB0CRL421RJ&lp_query=bed&lp_slot=desktop-hsa-3psl&pd_rd_w=EA0JG&content-id=amzn1.sym.5594c86b-e694-4e3e-9301-a074f0faf98a%3Aamzn1.sym.5594c86b-e694-4e3e-9301-a074f0faf98a&pf_rd_p=5594c86b-e694-4e3e-9301-a074f0faf98a&pf_rd_r=88K0QWZ67E7H0R6DTTW9&pd_rd_wg=JxUMu&pd_rd_r=2a82bbe1-ed91-401b-9a41-28fb9c04de7d&linkCode=ll2&tag=zijaecommerce-20&linkId=67113c1d0231e39b51563e71e64460b3&language=en_US&ref_=as_li_ss_tl",
    imagePath: "/Fbed.jpg",
  },
];

const FeaturedSection = () => {
  return (
    <section className="px-4 sm:px-8 lg:px-20 py-10 md:py-16 bg-gray-50">
      {/* Section Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Featured on Amazon</h2>
        <p className="mt-2 text-lg text-gray-600">Click on a category to visit the Amazon store and see great deals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-center">
        {FeaturedProducts.map((product) => (
          <div
            key={product.id}
            className="relative border border-gray-400 shadow-md"
          >
            <a
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[350px]">
                <Image
                  src={product.imagePath}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                {/* Overlay for product name */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                  <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl text-center text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
