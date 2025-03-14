import Link from "next/link";
import React from "react";

const Success = (props:{title:string, description: string}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">{props.title} </h1>
        <p className="text-gray-700">{props.description}</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Success;
