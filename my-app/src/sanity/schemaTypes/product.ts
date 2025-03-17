// Define an interface for the required fields used in slug generation
interface ProductDoc {
  productNameEn?: string;
  CategoryName?: string[];
}

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
      type: "string",
      description: 'A detailed description of the product (rich text content)',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Average rating of the product (out of 5)',
    },
    {
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
      description: 'Available inventory count for the product',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags associated with the product. [Best Seller]',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'URL-friendly identifier auto-generated from the product name and category',
      options: {
        source: (doc: ProductDoc): string => {
          const productName = doc.productNameEn || '';
          // Use first category name if available
          const categoryName =
            doc.CategoryName && doc.CategoryName.length > 0 ? doc.CategoryName[0] : '';
          return `${productName}-${categoryName}`;
        },
        slugify: (input: string): string =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    // Add your SEO metadata field here
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'The title used for SEO and social sharing',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'A brief description used for SEO and social sharing',
        },
        {
          name: 'metaKeywords',
          title: 'Meta Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'A list of keywords used for SEO',
        },
      ],
    },
    {
      name: 'variants',
      title: 'Variants',
      type: 'object',
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
};
