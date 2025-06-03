import React from 'react';
import { 
  FaTruck, 
  FaUndo, 
  FaLock, 
  FaStar,
} from 'react-icons/fa';

const SubFooter = () => {
  return (
    <div className="w-full bg-white md:py-16 py-10 px-4 sm:px-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Shipping */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-black rounded-full p-5 mb-6">
              <FaTruck className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Fast & Free Shipping</h3>
            <div className="h-0.5 w-20 bg-black mb-6 mx-auto"></div>
            <p className="text-gray-600 mb-4">
              All orders ship within 24 hours from our US warehouses. Free ground shipping on orders over $50.
            </p>
            <ul className="text-left w-full max-w-xs mx-auto space-y-2">
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>2-3 business day delivery to most states</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>Real-time tracking updates</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>Free returns within 07 days</span>
              </li>
            </ul>
          </div>
          
          {/* Returns */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-black rounded-full p-5 mb-6">
              <FaUndo className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Hassle-Free Returns</h3>
            <div className="h-0.5 w-20 bg-black mb-6 mx-auto"></div>
            <p className="text-gray-600 mb-4">
              Not satisfied? Return any item within 07 days for a full refund. We make returns easy.
            </p>
            <ul className="text-left w-full max-w-xs mx-auto space-y-2">
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>Pre-paid return shipping labels</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>No restocking fees</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>Instant refund processing</span>
              </li>
            </ul>
          </div>
          
          {/* Security */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-black rounded-full p-5 mb-6">
              <FaLock className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Secure Payments</h3>
            <div className="h-0.5 w-20 bg-black mb-6 mx-auto"></div>
            <p className="text-gray-600 mb-4">
              Your payment information is protected with bank-level security. We never store your credit card details.
            </p>
            <ul className="text-left w-full max-w-xs mx-auto space-y-2">
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>256-bit SSL encryption</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>PCI-DSS Level 1 certified</span>
              </li>
              <li className="flex items-start">
                <FaStar className="text-black mt-1 mr-2 flex-shrink-0" />
                <span>Fraud protection guarantee</span>
              </li>
            </ul>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default SubFooter;