import { Rule } from "sanity";

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
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(1),
    },
    {
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      readOnly: true,
      description: 'Calculated as product price * quantity (set via backend)',
    },
  ],
};
