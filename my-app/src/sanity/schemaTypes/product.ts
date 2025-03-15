// schemas/product.js
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'productNameEn',
      title: 'Product Name (EN)',
      type: 'string',
      description: 'The product name in English',
    },
    {
      name: 'productSku',
      title: 'Product SKU',
      type: 'string',
      description: 'Stock Keeping Unit for the product',
    },
    {
      name: 'productImageSet',
      title: 'Product Images',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Array of image URLs for the product',
    },
    {
      name: 'categoryId',
      title: 'Category ID',
      type: 'string',
      description: 'The unique identifier for the category',
    },
    {
      name: 'CategoryName',
      title: 'Category Names',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Array of category names',
    },
    {
      name: 'packingWeight',
      title: 'Packing Weight',
      type: 'number',
      description: 'Weight of the packaging',
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'A short description of the product',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A detailed description of the product (HTML content)',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Average rating of the product (out of 5)',
    },
    {
      name: 'variants',
      title: 'Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            {
              name: 'vid',
              title: 'Variant ID',
              type: 'string',
              description: 'The unique ID for the variant',
            },
            {
              name: 'variantSellPrice',
              title: 'Variant Sell Price',
              type: 'number',
              description: 'The current selling price for this variant',
            },
            {
              name: 'variantSugSellPrice',
              title: 'Variant Suggested Sell Price',
              type: 'number',
              description: 'The suggested selling price for this variant',
            },
            {
              name: 'variantactualSellPrice',
              title: 'Variant Actual Sell Price',
              type: 'number',
              description: 'The actual selling price for this variant',
            },
            {
              name: 'discountPercentage',
              title: 'Discount Percentage',
              type: 'number',
              description: 'Discount percentage applied to this variant',
            },
          ],
        },
      ],
      description: 'Array of product variants',
    },
  ],
};
