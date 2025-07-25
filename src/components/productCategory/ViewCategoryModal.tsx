"use client";
 import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';

interface Props {
  onClose: () => void;
}

const ViewCategoryModal: React.FC<Props> = ({ onClose }) => {
  const { selectedCategory } = useSelector((state: RootState) => state.category);

  if (!selectedCategory) return null;

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-[500px] p-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Category Details</h2>

        <div className="space-y-3 text-sm">
          <div>
            <strong>Name:</strong> {selectedCategory.name}
          </div>
          <div>
            <strong>Description:</strong> {selectedCategory.description}
          </div>
          <div>
            <strong>Slug:</strong> {selectedCategory.slug}
          </div>
         {/* <div>
             
  <span>Created At:</span> {new Date(selectedCategory.createdAt).toLocaleString()}
</div>
<div>
  <span>Updated At:</span> {new Date(selectedCategory.updatedAt).toLocaleString()}
</div> */}

          {selectedCategory.imageUrl && (
            <div>
              <strong>Image:</strong>
              <img
                src={selectedCategory.imageUrl}
                alt={selectedCategory.name}
                className="mt-2 w-full h-40 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewCategoryModal;
