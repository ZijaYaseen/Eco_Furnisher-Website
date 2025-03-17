import { client } from "@/sanity/lib/client";
import Link from "next/link";

// Generate static routes using product slug
export async function generateStaticParams() {
  const query = `*[_type == "product"]{ "slug": slug.current }`;
  const products: { slug: string }[] = await client.fetch(query);
  return products.map((prod) => ({ product: prod.slug }));
}

// Set metadata for SEO
export async function generateMetadata({ params }: { params: { product: string } }) {
  const query = `*[_type == "product" && slug.current == $product][0]{
    productNameEn,
    seo {
      metaTitle,
      metaDescription
    },
    shortDescription
  }`;
  const product = await client.fetch(query, { product: params.product });
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.seo?.metaTitle || product.productNameEn,
    description: product.seo?.metaDescription || product.shortDescription,
  };
}

// Fetch product data and top picks, then render the client component
export default async function ProductPage({ params }: { params: { product: string } }) {
  const query = `*[_type == "product" && slug.current == $product][0]{
    _id,
    productNameEn,
    productSku,
    "imageSet": productImageSet,
    rating,
    shortDescription,
    description,
    categoryId,
    CategoryName,
    packingWeight,
    inventory,
    tags,
    seo {
      metaTitle,
      metaDescription,
      metaKeywords
    },
    variants{
      vid,
      variantSellPrice,
      variantSugSellPrice,
      variantactualSellPrice,
      discountPercentage
    },
    size,
    color
  }`;
  
  // Fetch Product Data
  const product = await client.fetch(query, { product: params.product }, { cache: "no-store" });
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
        <Link href="/">
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Home Page
          </button>
        </Link>
      </div>
    );
  }
}
