"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { FiX, FiChevronLeft, FiPackage, FiTruck, FiInfo } from "react-icons/fi";
import { fetchProductById } from "@/services/product/productService";
import { toast } from "react-toastify";
import Image from "next/image";
import { Product } from "@/components/types/product";

const ViewProductPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      // Validate product ID
      if (!productId || isNaN(Number(productId))) {
        setError("Invalid product ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const productData = await fetchProductById(Number(productId));

        if (!productData) {
          setError("Product not found");
          return;
        }

        setSelectedProduct(productData.product || productData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load product details";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleClose = () => {
    router.back();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const calculateFinalPrice = (originalPrice: number, offer: number): number => {
    if (!offer || offer === 0) return originalPrice;
    return Math.round(originalPrice - (originalPrice * offer) / 100);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle keyboard navigation for image gallery
  const handleImageKeyboard = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveImageIndex(index);
    }
  };

  // Get lowest variant price
  const getLowestVariantPrice = (product: Product) => {
    if (!product?.variants?.length) return null;

    const prices = product.variants
      .map((v) => Number(v.sellingPrice ?? v.price ?? 0))
      .filter((p) => p > 0);

    return prices.length ? Math.min(...prices) : null;
  };

  // Get total variant stock
  const getTotalVariantStock = (product: Product) => {
    if (!product?.variants?.length) return product.stock ?? 0;

    return product.variants.reduce(
      (sum, v) => sum + Number(v.stock ?? 0),
      0
    );
  };

  // Derived values
  const hasVariants = selectedProduct?.variants && selectedProduct.variants.length > 0;
  const lowestVariantPrice = hasVariants ? getLowestVariantPrice(selectedProduct) : null;

  const displayPrice = hasVariants
    ? lowestVariantPrice
    : selectedProduct?.price ??
      calculateFinalPrice(
        Number(selectedProduct?.originalPrice ?? 0),
        Number(selectedProduct?.offer ?? 0)

      );

  const displayStock = hasVariants
    ? getTotalVariantStock(selectedProduct)
    : selectedProduct?.stock ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
                aria-label="Go back"
              >
                <FiChevronLeft size={24} />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Product Details
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading product details...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-96 text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">{error}</p>
                <p className="text-sm text-gray-500 mb-6">
                  The product you're looking for could not be loaded.
                </p>
                <Button onClick={handleClose} className="px-6 py-2">
                  Go Back
                </Button>
              </div>
            ) : selectedProduct ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <>
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                          {!imageError ? (
                            <Image
                              src={selectedProduct.images[activeImageIndex].imageUrl}
                              alt={`${selectedProduct.name} - Main view`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority={activeImageIndex === 0}
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <div className="text-center">
                                <svg
                                  className="w-16 h-16 mx-auto mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-sm">Image not available</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {selectedProduct.images.map((img, index) => (
                              <button
                                key={img.id}
                                onClick={() => {
                                  setActiveImageIndex(index);
                                  setImageError(false);
                                }}
                                onKeyDown={(e) => handleImageKeyboard(e, index)}
                                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                  activeImageIndex === index
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                aria-label={`View image ${index + 1} of ${
                                  selectedProduct.images?.length
                                }`}
                                aria-current={activeImageIndex === index}
                              >
                                <Image
                                  src={img.imageUrl}
                                  alt={`${selectedProduct.name} - Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="100px"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                        <div className="text-center text-gray-400">
                          <svg
                            className="w-16 h-16 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm">No images available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h1>
                      <p className="text-sm text-gray-500 mb-4">
                        Product ID: <span className="font-mono">{selectedProduct.id}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedProduct.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedProduct.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {selectedProduct.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Pricing Information
                      </h3>

                      <div className="space-y-3">
                        {/* Original price only when no variants */}
                        {!hasVariants && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="font-medium text-gray-700">
                              {formatCurrency(Number(selectedProduct.originalPrice))}
                            </span>
                          </div>
                        )}

                        {/* Variant badge */}
                        {hasVariants && (
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded w-fit">
                            Price varies by variant
                          </div>
                        )}

                        {/* Discount only for non-variant */}
                        {!hasVariants && Number(selectedProduct?.offer ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Discount:</span>
                            <span className="text-green-600 font-semibold">
                              {selectedProduct.offer}% OFF
                            </span>
                          </div>
                        )}

                        {/* FINAL PRICE */}
                        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                          <span className="text-gray-800 font-semibold">
                            {hasVariants ? "Starting Price:" : "Final Price:"}
                          </span>


                          <span className="text-2xl sm:text-3xl font-bold text-blue-700">
                            {formatCurrency(Number(displayPrice || 0))}
                          </span>
                        </div>

                        {/* STOCK */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Stock:</span>
                          <span className={`font-semibold ${
                            displayStock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {displayStock} {displayStock === 1 ? 'unit' : 'units'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stock & Shipping */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FiPackage className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-700">Stock</h4>
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            displayStock > 0 ? "text-gray-900" : "text-red-600"
                          }`}
                        >
                          {displayStock}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {displayStock > 0 ? "In Stock" : "Out of Stock"}
                        </p>

                        {hasVariants && (
                          <p className="text-[10px] text-purple-600 mt-1">
                            Calculated from variants
                          </p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTruck className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-700">Shipping</h4>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            selectedProduct.shippingAvailable
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedProduct.shippingAvailable
                            ? "Available"
                            : "Not Available"}
                        </p>
                      </div>
                    </div>
                   
                    {/* Additional Info */}
                    {(selectedProduct.material ||
                      selectedProduct.warrantyInfo ||
                      selectedProduct.returnPolicy ||
                      selectedProduct.manufactureDetails) && (
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FiInfo className="w-5 h-5" />
                          Product Details
                        </h3>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          {selectedProduct.material && (
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">
                                Material:
                              </span>
                              <span className="text-gray-900">
                                {selectedProduct.material}
                              </span>
                            </div>
                          )}
                          {/* {selectedProduct.warrantyInfo && ( */}
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">
                                Warranty:
                              </span>
                              <span className="text-gray-900">
                                {selectedProduct.warrantyInfo}
                              </span>
                            </div>
                          {/* )} */}
                          {selectedProduct.returnPolicy && (
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600 font-medium">
                                Return Policy:
                              </span>
                              <span className="text-gray-900">
                                {selectedProduct.returnPolicy}
                              </span>
                            </div>
                          )}
                          {selectedProduct.manufactureDetails && (
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600 font-medium">
                                Manufacture:
                              </span>
                              <span className="text-gray-900 text-right max-w-xs">
                                {selectedProduct.manufactureDetails}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {selectedProduct.description && (
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h7"
                            />
                          </svg>
                          Description
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}
 {(selectedProduct.length ||
  selectedProduct.width ||
  selectedProduct.height ||
  selectedProduct.weight) && (
  <>
    {selectedProduct.length && (
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-600 font-medium">Length:</span>
        <span className="text-gray-900">
          {selectedProduct.length} cm
        </span>
      </div>
    )}

    {selectedProduct.width && (
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-600 font-medium">Width:</span>
        <span className="text-gray-900">
          {selectedProduct.width} cm
        </span>
      </div>
    )}

    {selectedProduct.height && (
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-600 font-medium">Height:</span>
        <span className="text-gray-900">
          {selectedProduct.height} cm
        </span>
      </div>
    )}

    {selectedProduct.weight && (
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-600 font-medium">Weight:</span>
        <span className="text-gray-900">
          {selectedProduct.weight} {selectedProduct.weightUnit || "g"}
        </span>
      </div>
    )}
  </>
)}
                    {/* URL */}
                    {selectedProduct.url && (
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          Product URL
                        </h3>
                        <a
                          href={selectedProduct.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline inline-flex items-center gap-1"
                        >
                          {selectedProduct.url}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variants Section */}
                {selectedProduct?.variants?.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      Product Variants
                      <span className="text-sm font-normal text-gray-500">
                        ({selectedProduct.variants.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProduct.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all hover:border-blue-300"
                        >
                          <div className="space-y-4">
                            {/* SKU */}
                            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                SKU
                              </span>
                              <span className="text-sm font-semibold text-gray-900 font-mono">
                                {variant.sku}
                              </span>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  Original Price:
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    variant.sellingPrice
                                      ? "line-through text-gray-400"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {formatCurrency(Number(variant.price))}
                                </span>
                              </div>
                              {variant.sellingPrice && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">
                                    Selling Price:
                                  </span>
                                  <span className="text-lg font-bold text-green-600">
                                    {formatCurrency(Number(variant.sellingPrice))}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Stock */}
                            <div className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded-lg">
                              <span className="text-sm text-gray-600 font-medium">
                                Stock:
                              </span>
                              <span
                                className={`text-sm font-semibold ${
                                  variant.stock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {variant.stock} {variant.stock === 1 ? "unit" : "units"}
                              </span>
                            </div>

                            {/* Attributes */}
                            {variant.attributes?.length > 0 && (
                              <div className="pt-2 border-t border-gray-100">
                                <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
                                  Attributes
                                </h5>
                                <ul className="space-y-1.5">
                                  {variant.attributes.map((attr, index) => (
                                    <li key={index} className="flex items-start text-sm">
                                      <span className="text-gray-600 font-medium min-w-[80px]">
                                        {attr.key}:
                                      </span>
                                      <span className="text-gray-900 ml-2">
                                        {attr.value}
                                      </span>
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage; 