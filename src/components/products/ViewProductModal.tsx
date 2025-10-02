"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { FiX } from "react-icons/fi";
import { fetchProductById } from "@/services/product/productService";
import { toast } from "react-toastify";
import Image from "next/image";
import { Product, Variant } from "@/components/types/product";
interface Props {
  isOpen: boolean;
  onClose: () => void;

  productId: string | null;
}

const ViewProductModal: React.FC<Props> = ({ isOpen, onClose, productId }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !productId) {
      setSelectedProduct(null);
      setActiveImageIndex(0);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
        // const productData = await fetchProductById(productId, token);
        const productData = await fetchProductById(Number(productId), token);

        console.log(productData);
        setSelectedProduct(productData.product || productData);
      } catch (error) {
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId]);

  if (!isOpen || !productId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
      <div className="relative bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-64 text-red-500">
              <p className="text-lg font-medium mb-2">{error}</p>
              <Button onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          ) : selectedProduct ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <Image
                        src={selectedProduct.images[activeImageIndex].imageUrl}
                        alt={selectedProduct.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Thumbnail Gallery */}
                    {selectedProduct.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.images.map((img, index) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative aspect-square overflow-hidden rounded-md border-2 ${activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'}`}
                          >
                            <Image
                              src={img.imageUrl}
                              alt={`${selectedProduct.name} - ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center aspect-square w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                    No images available
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                  <p className="text-sm text-gray-500 mb-4">Product ID: {selectedProduct.id}</p>

                  <div className="flex items-center gap-4 mb-4">


                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedProduct.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {selectedProduct.category?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Pricing Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="font-medium">₹{selectedProduct.originalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 font-medium">{selectedProduct.offer || 0}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-100">
                      <span className="text-gray-800 font-semibold">Final Price:</span>
                      <span className="text-xl font-bold text-blue-700">
                        ₹{selectedProduct.price ?? selectedProduct.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock & Shipping */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Stock</h4>
                    <p className="text-2xl font-bold text-gray-900">{selectedProduct.stock ?? 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Shipping</h4>
                    <p className={`text-sm font-medium ${selectedProduct.shippingAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedProduct.shippingAvailable ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-medium">{selectedProduct.material || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-medium">{selectedProduct.warrantyInfo || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return Policy:</span>
                      <span className="font-medium">{selectedProduct.returnPolicy || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manufacture Details:</span>
                      <span className="font-medium text-right">{selectedProduct.manufactureDetails || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                {/* URL */}
                {selectedProduct.url && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Product URL</h3>
                    <a
                      href={selectedProduct.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {selectedProduct.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Variants Section */}
          {selectedProduct?.variants && selectedProduct.variants.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProduct.variants.map((variant) => (
                  <div key={variant.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h1 className="text-gray-900">SUK</h1>
                        <h4 className="font-medium text-gray-900">{variant.sku}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {/* ₹{variant.price} */}
                          {/* {variant.sellingPrice} */}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <h2>Original Price</h2>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          ₹{Math.round(Number(variant.price))}<br></br>
                          {variant.sellingPrice && `  ₹${Math.round(Number(variant.sellingPrice))}`}
                        </span>
                      </div>


                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`text-sm font-medium ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock} available
                        </span>
                      </div>

                      {variant.attributes && variant.attributes.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Attributes:</h5>
                          <ul className="space-y-1">
                            {variant.attributes.map((attr, index) => (
                              <li key={index} className="flex text-sm">
                                <span className="text-gray-600 font-medium mr-1">{attr.key}:</span>
                                <span className="text-gray-800">{attr.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;