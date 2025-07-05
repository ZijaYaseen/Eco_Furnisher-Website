import type { PortableTextBlock } from '@portabletext/types';
import type { Product } from './index';

export const Nav = [
    {name:"Home", Link:"/"},
    {name:"Shop", Link:"/Shop"},
    {name:"About", Link:"/About"},
    {name:"Contact", Link:"/Contact"},
    {name:"Blogs", Link:"/Blog"},
]

export const Help = [
    {name:"Payment Options", Link:"/"},
    {name:"Returns", Link:"/"},
    {name:"Privacy Policies", Link:"/"},

];
  

export const blog = [
    {
        image:"blog1.svg",
        title:"Going all-in with millennial design",
    },
    {
        image:"blog2.svg",
        title:"Going all-in with millennial design",
    },
    {
        image:"blog3.svg",
        title:"Going all-in with millennial design",
    },
];

export const blogposts = [
    {
        image:"/blogPost1.svg",
        title :"Going all-in with millennial design",
        description :"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
        Link :"/"
    },
    {
        image:"/blogPost2.svg",
        title :"Exploring new ways of decorating",
        description :"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
        Link :"/"
    },
    {
        image:"/blogPost3.svg",
        title :"Handmade pieces that took time to make",
        description :"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc. In nulla posuere sollicitudin aliquam ultrices. Morbi blandit cursus risus at ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in. Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis nunc sed blandit libero. Pellentesque elit ullamcorper dignissim cras tincidunt. Pharetra et ultrices neque ornare aenean euismod elementum.",
        Link :"/"
    },

];

export const shortBlogs = [
    {
        image :"/shortBlog1.svg",
        title :"Going all-in with millennial design",
        date:"03 Aug 2022",
    },
    {
        image :"/shortBlog2.svg",
        title :"Exploring new ways of decorating",
        date:"03 Aug 2022",
    },
    {
        image :"/shortBlog3.svg",
        title :"Handmade pieces that took time to make",
        date:"03 Aug 2022",
    },
    {
        image :"/shortBlog4.svg",
        title :"Modern home in Milan",
        date:"03 Aug 2022",
    },
    {
        image :"/shortBlog5.svg",
        title :"Colorful office redesign",
        date:"03 Aug 2022",
    },
]

/// for ecofurnisher ........
  
  // Product type matching Sanity schema
export interface Product {
  _id: string;
  productNameEn: string;
  productSku: string;
  imageSet: string[];
  categoryId: string;
  CategoryName: string[];
  packingWeight: number;
  shippingCharge: number;
  shortDescription: string;
  description: PortableTextBlock[];
  rating: number;
  inventory: number;
  tags: string[];
  slug: { current: string };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  variants: Array<{
    vid: string;
    variantSellPrice: number;
    variantSugSellPrice: number;
    variantActualSellPrice: number;
    discountPercentage: number;
    colors: { colorName: string; colorCode: string };
    variantImage: string;
  }>;
}

// CartItem type matching Sanity cartItem object
export interface CartItem {
  _key: string;
  product: Product;
  quantity: number;
  subtotal: number;
  discountedPrice : number;
  variantId: string; 
}

export interface WishlistItem {
  _key: string;
  product:  Product; // At minimum has _id, may have other product fields
} 

export interface Cart {
  cartItems : CartItem;
  grandTotal : number
}


  // categoriesData.ts

export const megaMenuData = [
  {
    name: "Furniture",
    columns: [
      {
        heading: "Bed Room Furniture",
        items: [
          { name: "Beds", link: "/furniture/beds" },
          { name: "Side Tables", link: "/furniture/side-tables" },
          { name: "Dressers", link: "/furniture/dressers" },
        ],
      },
      {
        heading: "Dining Room Furniture",
        items: [
          { name: "Dining Tables", link: "/furniture/dining-tables" },
          { name: "Dining Chairs", link: "/furniture/dining-chairs" },
          { name: "Crockery Units", link: "/furniture/crockery-units" },
        ],
      },
      {
        heading: "Kids Room Furniture",
        items: [
          { name: "Bunk Beds", link: "/furniture/bunk-beds" },
          { name: "Study Desks", link: "/furniture/study-desks" },
        ],
      },
      {
        heading: "Office Furniture",
        items: [
          { name: "Office Chairs", link: "/furniture/office-chairs" },
          { name: "Office Tables", link: "/furniture/office-tables" },
        ],
      },
    ],
  },
  {
    name: "Beds",
    columns: [
      {
        heading: "Bed Furniture",
        items: [
          { name: "Platform Bed", link: "/furniture/beds" },
          { name: "Storage Bed", link: "/furniture/side-tables" },
          { name: "Bunk Bed", link: "/furniture/dressers" },
        ],
      }
    ],
  },
  {
    name: "Wardrobe",
    columns: [
      {
        heading: "Bed Room Furniture",
        items: [
          { name: "Beds", link: "/furniture/beds" },
          { name: "Side Tables", link: "/furniture/side-tables" },
          { name: "Dressers", link: "/furniture/dressers" },
        ],
      },
      {
        heading: "Dining Room Furniture",
        items: [
          { name: "Dining Tables", link: "/furniture/dining-tables" },
          { name: "Dining Chairs", link: "/furniture/dining-chairs" },
          { name: "Crockery Units", link: "/furniture/crockery-units" },
        ],
      },
      {
        heading: "Kids Room Furniture",
        items: [
          { name: "Bunk Beds", link: "/furniture/bunk-beds" },
          { name: "Study Desks", link: "/furniture/study-desks" },
        ],
      },
      {
        heading: "Office Furniture",
        items: [
          { name: "Office Chairs", link: "/furniture/office-chairs" },
          { name: "Office Tables", link: "/furniture/office-tables" },
        ],
      },
    ],
  },
  {
    name: "Lighting",
    columns: [
      {
        heading: "Indoor Lights",
        items: [
          { name: "Chandeliers", link: "/lighting/chandeliers" },
          { name: "Ceiling Lamps", link: "/lighting/ceiling-lamps" },
        ],
      },
      {
        heading: "Outdoor Lights",
        items: [
          { name: "Garden Lights", link: "/lighting/garden-lights" },
          { name: "Wall Lamps", link: "/lighting/wall-lamps" },
        ],
      },
    ],
  },
  {
    name: "Tables",
    columns: [
      {
        heading: "Indoor Lights",
        items: [
          { name: "Chandeliers", link: "/lighting/chandeliers" },
          { name: "Ceiling Lamps", link: "/lighting/ceiling-lamps" },
        ],
      },
      {
        heading: "Outdoor Lights",
        items: [
          { name: "Garden Lights", link: "/lighting/garden-lights" },
          { name: "Wall Lamps", link: "/lighting/wall-lamps" },
        ],
      },
    ],
  },
  {
    name: "Chairs",
    columns: [
      {
        heading: "Indoor Lights",
        items: [
          { name: "Chandeliers", link: "/lighting/chandeliers" },
          { name: "Ceiling Lamps", link: "/lighting/ceiling-lamps" },
        ],
      },
      {
        heading: "Outdoor Lights",
        items: [
          { name: "Garden Lights", link: "/lighting/garden-lights" },
          { name: "Wall Lamps", link: "/lighting/wall-lamps" },
        ],
      },
    ],
  },
  {
    name: "Sofa & Couches",
    columns: [
      {
        heading: "Indoor Lights",
        items: [
          { name: "Chandeliers", link: "/lighting/chandeliers" },
          { name: "Ceiling Lamps", link: "/lighting/ceiling-lamps" },
        ],
      },
      {
        heading: "Outdoor Lights",
        items: [
          { name: "Garden Lights", link: "/lighting/garden-lights" },
          { name: "Wall Lamps", link: "/lighting/wall-lamps" },
        ],
      },
    ],
  },
  {
    name: "Decor",
    columns: [
      {
        heading: "Wall Art",
        items: [
          { name: "Paintings", link: "/decor/paintings" },
          { name: "Wall Hangings", link: "/decor/wall-hangings" },
        ],
      },
      {
        heading: "Mirrors",
        items: [
          { name: "Round Mirrors", link: "/decor/round-mirrors" },
          { name: "Full-Length Mirrors", link: "/decor/full-mirrors" },
        ],
      },
    ],
  },
  {
    name: "Kitchen",
    columns: [
      {
        heading: "Dinnerware",
        items: [
          { name: "Plates", link: "/kitchen/plates" },
          { name: "Bowls", link: "/kitchen/bowls" },
        ],
      },
      // ...
    ],
  },
  {
    name: "Outdoor",
    columns: [
      {
        heading: "Patio Furniture",
        items: [
          { name: "Outdoor Sofas", link: "/outdoor/sofas" },
          { name: "Garden Chairs", link: "/outdoor/chairs" },
        ],
      },
      // ...
    ],
  },
];

// Order-related types for reuse across the project
export type VariantMeta = {
  vid: string;
  quantity: number;
  subtotal: number;
  image?: string;
};

export type OrderItemMeta = {
  product: { _ref: string };
  variants: VariantMeta[];
  Total: number;
};

export type ShippingDetailsMeta = {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
};

export type PaymentDetailsMeta = {
  transactionId: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentDate: string;
};

export type OrderMeta = {
  userId?: string;
  shippingDetails: ShippingDetailsMeta;
  billingDetails?: ShippingDetailsMeta;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  orderItems: OrderItemMeta[];
  orderTotal: number;
  shippingCost: number;
  taxAmount: number;
};

export interface OrderDetails {
  _id: string;
  createdAt: string;
  orderStatus: 'pending' | 'paid';
  orderTotal: number;
  shippingCost: number;
  taxAmount: number;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  trackingNumber?: string;
  trackingStatus: 'pending' | 'shipped' | 'delivered';
  shippingDetails: ShippingDetailsMeta;
  paymentDetails: PaymentDetailsMeta;
  orderItems: OrderItemMeta[];
}

export interface OrderItemWithProduct {
  product: Product;
  variants: VariantMeta[];
  Total: number;
}

export interface OrderDetailsWithProduct extends Omit<OrderDetails, 'orderItems'> {
  orderItems: OrderItemWithProduct[];
}

  
