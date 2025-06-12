// schemas/wishlist.js
export default {
  name: 'wishlist',
  type: 'document',
  title: 'Wishlist',
  fields: [
    {
      name: 'user',
      type: 'reference',
      to: [{type: 'user'}],
      title: 'User',
    },
    {
      name: 'guestId',
      type: 'string',
      title: 'Guest ID',
    },
    {
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [
        {
          type: 'object',
          name: 'wishlistItem',
          fields: [
            {
              name: 'product',
              type: 'reference',
              to: [{ type: 'product' }],
              title: 'Product'
            }
          ],
          // Add this to generate _key automatically
          options: {
            hotspot: true,
          },
        }
      ]
    }
  ],
}