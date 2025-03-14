import React from "react";

interface OutOfStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OutOfStockModal: React.FC<OutOfStockModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold text-red-600">⚠ Out of Stock</h2>
        <p className="text-gray-700 mt-2">Sorry, this product is currently unavailable in the selected quantity.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default OutOfStockModal;
