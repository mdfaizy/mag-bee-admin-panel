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
          <div><span>ID:</span> {selectedProduct.id}</div>
          <div><span>Name:</span> {selectedProduct.name}</div>
          <div><span>Description:</span> {selectedProduct.description}</div>
          <div><span>Original Price:</span> ₹{selectedProduct.originalPrice}</div>
          <div><span>Offer (%):</span> {selectedProduct.offer}%</div>
          <div><span>Final Price:</span> ₹{selectedProduct.finalPrice}</div>
          <div><span>URL:</span> <a href={selectedProduct.url} target="_blank" className="text-blue-600 underline">{selectedProduct.url}</a></div>
          {/* <div><span>Created At:</span> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : 'N/A'}</div>
          <div><span>Updated At:</span> {selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : 'N/A'}</div> */}

          {selectedProduct.imageUrl && (
            <div>
              <span>Image:</span>
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


