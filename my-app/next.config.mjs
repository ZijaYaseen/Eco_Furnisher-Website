/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**', // Allow all images from this domain
        },
        {
          protocol: 'https',
          hostname: 'plus.unsplash.com',
          pathname: '/**', // If you're also using this domain
        },
        {
            protocol:"https",
            hostname:"next-ecommerce-template-4.vercel.app",
            pathname:"/**",
        },
        {
          protocol: "https",
          hostname :"asset.cloudinary.com",
          pathname :"/**",
        },
        {
          protocol: "https",
          hostname :"res.cloudinary.com",
          pathname :"/**",
        },
        {
          protocol: "https",
          hostname: "m.media-amazon.com",
          pathname: "/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  