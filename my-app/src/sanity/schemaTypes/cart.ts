export default {
  name: 'cart',
  title: 'Cart',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      name: 'guestId',
      title: 'Guest ID',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'cartItem' }],
    },
  ],
};
