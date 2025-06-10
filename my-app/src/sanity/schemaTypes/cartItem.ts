import { Rule } from "sanity";

// schemas/cartItem.ts
export default {
  name: 'cartItem',
  title: 'Cart Item',
  type: 'object',
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'variantId',
      title: 'Variant ID',
      type: 'string',
      description: 'ID of the selected variant',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(1),
    },
    {
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      description: 'Total price for this item (quantity * price)',
    },
    {
      name: 'discountedPrice',
      title: 'Discounted Price',
      type: 'number',
      description: 'Price per item after discount',
    },
  ],
};