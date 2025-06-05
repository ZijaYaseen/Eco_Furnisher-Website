import { client } from "./client";

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
      }
    }
  `;
  return await client.fetch(query, { searchQuery: `*${searchQuery}*` }, { cache: "no-store" });
}


// Best seller section product data
export async function BestSellerSanity() {
  const query = `
    *[_type == "product"]{
      _id,
      slug { current },
      productNameEn,
      productSku,
      "imagePath": productImageSet[0],
      "imageSet" : productImageSet,
      rating,
      description,
      shortDescription,
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
      }
    }
  `;
  return await client.fetch(query, {}, { cache: "no-store" });
}




// Top Picks product data
export async function TopPicksDataSanity() {

  const query = `
  *[_type == "product" && "Top Picks" in tags[]] {
    _id,
    name,
    imagePath,
    amazonLink,
  }
  `;
  return await client.fetch(query);
};

// New Arrivals product data
export async function NewArrivalsSanity() {
  const query = `
  *[_type == "product" && "One Product" in tags] {
    _id,
    name,
    imagePath,
    amazonLink,
    tags
  }
  `;
  return await client.fetch(query);
}

