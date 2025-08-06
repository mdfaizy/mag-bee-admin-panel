// "use client";
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { Modal } from '../ui/modal';
// import Button from '../ui/button/Button';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ViewProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const { selectedProduct } = useSelector((state: RootState) => state.product);

//   if (!isOpen || !selectedProduct) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-4">
//       <div className="p-4">
//         <h2 className="text-xl font-semibold mb-4">Product Details</h2>
//         <div className="space-y-2 text-sm">
//           <div><span>ID:</span> {selectedProduct.id}</div>
//           <div><span>Name:</span> {selectedProduct.name}</div>
//           <div><span>Description:</span> {selectedProduct.description}</div>
//           <div><span>Original Price:</span> ₹{selectedProduct.originalPrice}</div>
//           <div><span>Offer (%):</span> {selectedProduct.offer}%</div>
//           <div><span>Final Price:</span> ₹{selectedProduct.finalPrice}</div>
//           <div><span>URL:</span> <a href={selectedProduct.url} target="_blank" className="text-blue-600 underline">{selectedProduct.url}</a></div>
//           {/* <div><span>Created At:</span> {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleString() : 'N/A'}</div>
//           <div><span>Updated At:</span> {selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleString() : 'N/A'}</div> */}

//           {selectedProduct.imageUrl && (
//             <div>
//               <span>Image:</span>
//               <img
//                 src={selectedProduct.imageUrl}
//                 alt={selectedProduct.name}
//                 className="mt-2 w-full h-40 object-cover rounded"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end mt-6">
//           <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white">
//             Close
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ViewProductModal;




"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { FiX } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ViewProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedProduct } = useSelector((state: RootState) => state.product);

  if (!isOpen || !selectedProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="relative p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
            <p className="text-sm text-gray-500">Product ID: {selectedProduct.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {selectedProduct.imageUrl ? (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-64 object-contain"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-3">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-medium">₹{selectedProduct.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600">{selectedProduct.offer}% OFF</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-800 font-semibold">Final Price:</span>
                  <span className="text-lg font-bold text-blue-600">₹{selectedProduct.finalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-3">Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{selectedProduct.description || 'No description available'}</p>
                </div>
                {selectedProduct.url && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Product URL</p>
                    <a 
                      href={selectedProduct.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selectedProduct.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end border-t pt-4">
          <Button 
            onClick={onClose} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;