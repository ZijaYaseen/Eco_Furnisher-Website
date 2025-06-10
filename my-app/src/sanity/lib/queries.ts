// Sanity client import
import { client } from "./client";

// Fetch products based on search (name or category)
export async function GetProductsData(searchQuery: string = '') {
  const query = `
    *[_type == "product" &&
      (productNameEn match $searchQuery || CategoryName match $searchQuery)
    ]{
      _id,
      slug { current },
      productNameEn,
      productSku,
      "imagePath": productImageSet[0],
      "imageSet": productImageSet,
      rating,
      description,
      shortDescription,
      categoryId,
      CategoryName,
      packingWeight,
      shippingCharge,
      inventory,
      tags,
      seo {
        metaTitle,
        metaDescription,
        metaKeywords
      },
      variants[]{
        vid,
        variantSellPrice,
        variantSugSellPrice,
        variantActualSellPrice,
        discountPercentage,
        colors{ colorName, colorCode },
        variantImage
      }
    }
  `;
  return await client.fetch(query, { searchQuery: `*${searchQuery}*` }, { cache: "no-store" });
}

// Best Seller products
export async function BestSellerSanity() {
  const query = `
    *[_type == "product" && "Best Seller" in tags]{
      _id,
      slug,
      productNameEn,
      productSku,
      "imagePath": productImageSet[0],
      "imageSet": productImageSet,
      rating,
      description,
      shortDescription,
      categoryId,
      CategoryName,
      packingWeight,
      shippingCharge,
      inventory,
      tags,
      seo {
        metaTitle,
        metaDescription,
        metaKeywords
      },
      variants[]{
        vid,
        variantSellPrice,
        variantSugSellPrice,
        variantActualSellPrice,
        discountPercentage,
        colors{ colorName, colorCode },
        variantImage
      }
    }
  `;
  return await client.fetch(query, {}, { cache: "no-store" });
}

// Top Picks products
export async function TopPicksDataSanity() {
  const query = `
    *[_type == "product" && "Top Picks" in tags]{
      _id,
      slug { current },
      productNameEn,
      productSku,
      "imagePath": productImageSet[0],
      "imageSet": productImageSet,
      rating,
      description,
      shortDescription,
      categoryId,
      CategoryName,
      packingWeight,
      shippingCharge,
      inventory,
      tags,
      seo {
        metaTitle,
        metaDescription,
        metaKeywords
      },
      variants[]{
        vid,
        variantSellPrice,
        variantSugSellPrice,
        variantActualSellPrice,
        discountPercentage,
        colors{ colorName, colorCode },
        variantImage
      }
    }
  `;
  return await client.fetch(query, {}, { cache: "no-store" });
}

// New Arrivals products
export async function NewArrivalsSanity() {
  const query = `
    *[_type == "product" && "New Arrival" in tags]{
      _id,
      slug { current },
      productNameEn,
      productSku,
      "imagePath": productImageSet[0],
      "imageSet": productImageSet,
      rating,
      description,
      shortDescription,
      categoryId,
      CategoryName,
      packingWeight,
      shippingCharge,
      inventory,
      tags,
      seo {
        metaTitle,
        metaDescription,
        metaKeywords
      },
      variants[]{
        vid,
        variantSellPrice,
        variantSugSellPrice,
        variantActualSellPrice,
        discountPercentage,
        colors{ colorName, colorCode },
        variantImage
      }
    }
  `;
  return await client.fetch(query, {}, { cache: "no-store" });
}
