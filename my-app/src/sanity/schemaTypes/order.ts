export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      description: 'Reference to the user if logged in',
    },
    {
      name: 'billingDetails',
      title: 'Billing Details',
      type: 'object',
      fields: [
        { name: 'firstName', title: 'First Name', type: 'string' },
        { name: 'lastName', title: 'Last Name', type: 'string' },
        { name: 'streetAddress', title: 'Street Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'zip', title: 'ZIP Code', type: 'string' },
        { name: 'country', title: 'Country', type: 'string', initialValue: 'USA' },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
      ],
    },
    {
      name: 'orderItems',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'product', 
              title: 'Product', 
              type: 'reference', 
              to: [{ type: 'product' }] 
            },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'subtotal', title: 'Subtotal', type: 'number' },
          ],
        },
      ],
    },
    {
      name: 'orderTotal',
      title: 'Order Total',
      type: 'number',
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Stripe', value: 'stripe' },
          { title: 'PayPal', value: 'paypal' },
        ],
      },
    },
    {
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        { name: 'transactionId', title: 'Transaction ID', type: 'string' },
        { name: 'paymentAmount', title: 'Amount Paid', type: 'number' },
        { name: 'paymentMethod', title: 'Payment Gateway', type: 'string' },
        { name: 'paymentDate', title: 'Payment Date', type: 'datetime' },
      ],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    },
    {
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
  ],
  initialValue: {
    createdAt: new Date().toISOString(),
  },
};