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

const ViewProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedProduct } = useSelector((state: RootState) => state.product);

  if (!isOpen || !selectedProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <div className="space-y-2 text-sm">
          <div><strong>ID:</strong> {selectedProduct.id}</div>
          <div><strong>Name:</strong> {selectedProduct.name}</div>
          <div><strong>Description:</strong> {selectedProduct.description}</div>
          <div><strong>Original Price:</strong> ₹{selectedProduct.originalPrice}</div>
          <div><strong>Offer (%):</strong> {selectedProduct.offer}%</div>
          <div><strong>Final Price:</strong> ₹{selectedProduct.finalPrice}</div>
          <div><strong>URL:</strong> <a href={selectedProduct.url} target="_blank" className="text-blue-600 underline">{selectedProduct.url}</a></div>
          <div><strong>Created At:</strong> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : 'N/A'}</div>
          <div><strong>Updated At:</strong> {selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : 'N/A'}</div>

          {selectedProduct.imageUrl && (
            <div>
              <strong>Image:</strong>
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
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

export default ViewProductModal;


