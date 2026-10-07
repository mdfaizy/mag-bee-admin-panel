"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ViewCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedCategory } = useSelector((state: RootState) => state.category);

  if (!selectedCategory) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Category Details</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-700">Name:</div>
              <div className="w-2/3 text-gray-900 font-semibold">{selectedCategory.name}</div>
            </div>

            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-700">Description:</div>
              <div className="w-2/3 text-gray-800">{selectedCategory.description || <span className="text-gray-400 italic">No description</span>}</div>
            </div>

            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-700">Slug:</div>
              <div className="w-2/3 text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded text-sm">{selectedCategory.slug}</div>
            </div>

            {/* Uncomment if you need to show dates
            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-700">Created At:</div>
              <div className="w-2/3 text-gray-600 text-sm">
                {new Date(selectedCategory.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-1/3 font-medium text-gray-700">Updated At:</div>
              <div className="w-2/3 text-gray-600 text-sm">
                {new Date(selectedCategory.updatedAt).toLocaleString()}
              </div>
            </div>
            */}

            {selectedCategory.imageUrl && (
              <div className="pt-2">
                <div className="font-medium text-gray-700 mb-2">Image:</div>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedCategory.imageUrl}
                    alt={selectedCategory.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
            <Button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors duration-200"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewCategoryModal;