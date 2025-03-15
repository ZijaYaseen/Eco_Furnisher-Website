import { client } from "./client";


// Hero section product data
export async function BestSellerSanity() {
  const query = `
  *[_type == "product"]{
    _id,
    productNameEn,
    productSku,
    "imagePath": productImageSet[0],
    rating,
    shortDescription,
    categoryId,
    CategoryName,
    packingWeight,
    variants[]{
      vid,
      variantactualSellPrice,
      discountPercentage
    }
  }
    `;
  return await client.fetch(query);
}





// for shop page data
export async function GetProductsData(searchQuery: string = '') {
  const query = `
    *[_type == 'product' && 
      (name match $searchQuery || category match $searchQuery)
    ] {
      _id,
      name,
      imagePath,
      description,
      price,
      category,
      stockLevel,
      size,
      color,
      discountPercentage,
      isFeaturedProduct
    }
  `;
  return await client.fetch(query, { searchQuery: `*${searchQuery}*` });
}


// Top Picks product data
export async function TopPicksData() {

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

