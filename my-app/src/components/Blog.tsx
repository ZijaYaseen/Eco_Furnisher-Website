// components/BlogSection.tsx
import Image from "next/image";

const blogs = [
  {
    title: "The 33 Best Last-Minute Mother’s Day Gifts",
    date: "UPDATED APRIL 4, 2025",
    author: "Samantha Schoech and Mari Uyehara",
    description: "If Mother’s Day has sneaked up on you, have no fear. We’ve got gifts of all kinds, available in a matter of days (or hours).",
    image: "/blog1.svg",
  },
  {
    title: "The Best Beauty Products to Gift Right Now",
    date: "PUBLISHED APRIL 4, 2025",
    author: "Hannah Morrill",
    description: "We dish on our favorite (highly giftable) beauty products. Plus: the best lotions, retinols, and what to get for a 90th birthday.",
    image: "/blog2.svg",
  },
  {
    title: "The Best Photo Book Service",
    date: "UPDATED APRIL 3, 2025",
    author: "Erin Roberts",
    description: "If you want to make a photo book to commemorate an event or experience, Mixbook is the best service to use.",
    image: "/blog3.svg",
  },
];

export default function BlogSection() {
  return (
    <div className="p-6 max-w-7xl mx-auto font-poppins">
      <h1 className="text-4xl font-bold mb-5 flex justify-center">Our Blogs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white">
            <div className="h-64 w-full relative mb-4">
              <Image src={blog.image} alt="blog" fill className="object-cover bg-gray-100" />
            </div>
            <div className="text-sm md:text-base grid gap-2">
            <h2 className="text-lg md:text-2xl font-bold">{blog.title}</h2>
            <p className="text-gray-500 font-semibold">{blog.date}</p>
            <p className="font-semibold">by {blog.author}</p>
            <p className="text-gray-700">{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
