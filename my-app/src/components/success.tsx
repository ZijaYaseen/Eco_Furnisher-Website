"use client"

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome } from "react-icons/fa";

const Success = ({ title, description }: { title: string; description: string }) => {
  const confettiRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Confetti effect
    if (confettiRef.current) {
      const confettiPieces = 100;
      const container = confettiRef.current;
      
      for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-2 h-2 bg-gray-300 rounded-full";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        container.appendChild(confetti);
      }
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Confetti container */}
      <div 
        ref={confettiRef} 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden w-full max-w-md"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-700 via-white to-gray-700" />
          
          <div className="p-8 z-10 relative">
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
              className="mx-auto mb-6 relative"
            >
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border-2 border-white">
                <svg 
                  className="w-16 h-16 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="green"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  />
                </svg>
              </div>
              
              {/* Pulsing circle effect */}
              <motion.div
                className="absolute inset-0 border-4 border-white rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </motion.div>

            {/* Content */}
            <motion.h1 
              className="text-3xl font-bold text-center text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {title}
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 text-center mb-8 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {description}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/">
                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg border border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <FaHome />
                  <span>Go to Homepage</span>
                </button>
              </Link>
            </motion.div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-900 bg-opacity-50 p-4 text-center text-gray-500 text-sm border-t border-gray-700">
            Thank you for your trust
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Success;