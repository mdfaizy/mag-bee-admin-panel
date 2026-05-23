"use client";
import {
  fetchProductsByGroup,
  updateProductGroup
} from "@/services/product/productService";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Input from "../../../../../../components/form/input/InputField";
import { HiChevronDown, HiX, HiPlus, HiUpload } from 'react-icons/hi';
import Label from "../../../../../../components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedProduct, setProducts } from "@/redux/productSlice";
import { fetchProductById, updateProductById } from "@/services/product/productService";
// import { fetchProductCategory } from "@/services/product-category/categoryService";
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { Product, Variant } from "@/components/types/product";
import { apiConnector } from "@/services/apiConnector";
import { calculateOfferPercentage } from "@/utils/priceUtils"
type ProductImageType = {
  id: number;
  imageUrl: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
};
type SubCategoryOption = {
  value: string;
  label: string;
  categoryId: string;
};
type ProductLite = {
  id: number;
  name: string;
  skuCode: string;
  variantGroupId?: number;
  // images?: { imageUrl: string }[];
  images?: ProductImageType[];
};

// ✅ Utility functions
const safeNum = (v: any, fallback = 0): number => {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

const computeSellingPrice = (price: number, offer: number): number => {
  const priceNum = safeNum(price, 0);
  const offerNum = safeNum(offer, 0);
  return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
};

const EditProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();

  const { selectedProduct, products } = useSelector((state: RootState) => state.product);

  // ✅ Consolidated state management
  const [formState, setFormState] = useState({
    data: null as any,
    variants: [] as Variant[],
    // images: [] as string[],
   images: [] as ProductImageType[],
    newImages: [] as File[],
    removedImageIds: [] as number[],
    loading: false,
    initialized: false,
  });
  const [options, setOptions] = useState({
    categories: [] as { value: string; label: string }[],
    subCategories: [] as SubCategoryOption[], // ⭐ ADD THIS
    subCategoryChildren: [] as { value: string; label: string }[],
    loading: true,
  });
  const [skuSearch, setSkuSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
  // const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);

  // const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);

  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];

  // ✅ Fetch product by ID on mount
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const res = await fetchProductById(Number(id));
        console.log('Product fetched:', res);
        dispatch(setSelectedProduct(res.product));
        setIsActive(res.product.isActive ?? true);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product');
      }
    };

    loadProduct();
  }, [id, dispatch]);

  const handleSkuSearch = async (value: string) => {
    setSkuSearch(value);

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await apiConnector("GET", `/search?sku=${value}`);

      setSearchResults(res.data?.products || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };
  const handleAddVariant = (product: ProductLite) => {
    if (selectedVariants.some(v => v.id === product.id)) {
      toast.warning("Already added");
      return;
    }

    setSelectedVariants(prev => [...prev, product]);

    setSearchResults([]);
    setSkuSearch("");
  };

  const handleRemoveVariant = (id: number) => {
    setSelectedVariants(prev => prev.filter(p => p.id !== id));
  };

  // ✅ Fetch categories and subcategories
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        setOptions(prev => ({ ...prev, loading: true }));

        const categoriesRes = await apiConnector("GET", "/category");
        const subCategoriesRes = await fetchSubCategoryAll();

        const categories = Array.isArray(categoriesRes.data?.categories)
          ? categoriesRes.data.categories
          : [];

        const formattedCategories = categories.map((cat: any) => ({
          value: String(cat.id),
          label: cat.name,
        }));

        const formattedSubCategories = subCategoriesRes.map((cat: any) => ({
          value: String(cat.id),
          label: cat.name,
          categoryId: String(cat.category?.id || ''),
        }));

        setOptions(prev => ({
          ...prev,
          categories: formattedCategories,
          subCategories: formattedSubCategories,
          loading: false,
        }));
      } catch (err) {
        console.error("Options fetch error", err);
        toast.error("Failed to load categories and subcategories");
        setOptions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchOptionsData();
  }, []);

  useEffect(() => {
    const loadGroupProducts = async () => {
      if (!selectedProduct?.variantGroupId) {
        setSelectedVariants([]);
        return;
      }

      try {
        const products = await fetchProductsByGroup(
          selectedProduct.variantGroupId
        );

        const others = products.filter(
          (p: any) => p.id !== selectedProduct.id
        );

        setSelectedVariants(others);

      } catch (err) {
        console.error("Group load error", err);
      }
    };

    loadGroupProducts();
  }, [selectedProduct]);

  // ✅ Initialize form data when selectedProduct changes
  useEffect(() => {
    // 🚫 guard clauses
    if (!selectedProduct) return;
    if (formState.initialized) return;
    // if (!options.subCategories.length) return;

    try {
      // =========================
      // ✅ Prepare variants
      // =========================
      const initialVariants: Variant[] = (selectedProduct.variants || []).map(
        (v: any) => {
          const price = safeNum(v.price, 0);
          const offer = safeNum(v.offer, 0);
          const sellingPrice = safeNum(
            v.sellingPrice,
            computeSellingPrice(price, offer)
          );

          return {
            id: v.id,
            sku: v.sku ?? "",
            price,
            sellingPrice,
            stock: safeNum(v.stock, 0),
            offer,
            attributes:
              (v.attributes || []).length > 0
                ? v.attributes.map((a: any) => ({
                  key: a.key ?? "",
                  value: a.value ?? "",
                }))
                : [{ key: "", value: "" }],
          };
        }
      );

      // =========================
      // ✅ Prepare images
      // =========================
      const typedProduct = selectedProduct as unknown as Product;

      const imageUrls =
        typedProduct.images?.map((img: any) =>
          typeof img === "string" ? img : img.imageUrl
        ) || [];

      // =========================
      // ✅ Filter subcategories
      // =========================
      let filtered: any[] = [];

      const categoryId = selectedProduct.category?.id;

      if (categoryId) {
        filtered = options.subCategories.filter(
          (sc: any) => sc.categoryId === String(categoryId)
        );
      }

      setFilteredSubCategory(filtered);
//       if (selectedProduct.subCategory?.id) {
//   fetchChildren(
//     String(selectedProduct.subCategory.id)
//   );
// }

if (selectedProduct.subCategory?.id) {

  fetchChildren(
    String(selectedProduct.subCategory.id)
  );

  setFormState((prev) => ({
    ...prev,
    data: {
      ...prev.data,
      childSubCategoryId:
        selectedProduct.childSubCategory?.id
          ? String(selectedProduct.childSubCategory.id)
          : "",
    },
  }));
}

      // =========================
      // ✅ Set form state (FULL)
      // =========================
      setFormState({
        data: {
          ...selectedProduct,
          categoryId: selectedProduct.category
            ? String(selectedProduct.category.id)
            : "",
          subCategoryId: selectedProduct.subCategory
            ? String(selectedProduct.subCategory.id)
            : "",
            childSubCategoryId:
  selectedProduct.childSubCategory?.id
    ? String(selectedProduct.childSubCategory.id)
    : "",
          originalPrice: safeNum(selectedProduct.originalPrice, 0),
          finalPrice: safeNum(selectedProduct.price, 0),
          offer: safeNum(selectedProduct.offer, 0),
          stock: safeNum(selectedProduct.stock, 0),
          shippingAvailable: selectedProduct.shippingAvailable ?? false,
          warrantyInfo: selectedProduct.warrantyInfo ?? "",
          skuCode: selectedProduct.skuCode ?? "",
          material: selectedProduct.material ?? "",
          returnPolicy: selectedProduct.returnPolicy ?? "",
          manufactureDetails:
            selectedProduct.manufactureDetails ?? "",
          // keywords: selectedProduct.keywords || [],
        keywords:
  (selectedProduct.keywords || [])
    .filter(
      (k) =>
        typeof k === "string"
    )
    .map((k) => k.trim()),
          length: selectedProduct.length ?? "",
          width: selectedProduct.width ?? "",
          height: selectedProduct.height ?? "",
          weight: selectedProduct.weight ?? "",
          weightUnit: selectedProduct.weightUnit ?? "kg",
          hasVariants: initialVariants.length > 0,
        },
        variants: initialVariants,
        images: imageUrls,
        newImages: [],
        removedImageIds: [],
        loading: false,
        initialized: true,
      });

      // =========================
      // ✅ Variant toggle
      // =========================
      setShowVariants(initialVariants.length > 0);
    } catch (error) {
      console.error("Error initializing form data:", error);
      toast.error("Failed to initialize form");
    }
  }, [selectedProduct, options.subCategories, formState.initialized]);


  // ✅ Fetch subcategory children
  const fetchChildren = async (parentId: string) => {
    try {
      const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
      const children = Array.isArray(res.data.children) ? res.data.children : res.data;
      const formatted = children.map((item: any) => ({
        value: String(item.id),
        label: item.name,
        parentId: String(parentId),
      }));

      setOptions(prev => ({ ...prev, subCategoryChildren: formatted }));
    } catch (error) {
      console.error("Failed to fetch subcategory children:", error);
      setOptions(prev => ({ ...prev, subCategoryChildren: [] }));
    }
  };
  // ✅ Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const filtered = options.subCategories.filter(
      sc => sc.categoryId === value
    );

    setFilteredSubCategory(filtered);

    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        categoryId: value,
        subCategoryId: "", // reset
        childSubCategoryId: "",
      }
    }));
  };
  // ✅ Handle subcategory changeD
  const handleSubCategoryChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        subCategoryId: value,
        childSubCategoryId: "",
      },
    }));
    fetchChildren(value);
  };

  // ✅ Handle basic field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    options?: {
      variantIndex?: number;
      attrIndex?: number;
      attrField?: "key" | "value";
    }
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (options?.variantIndex !== undefined) {
      const variantIndex = options.variantIndex;
      const attrIndex = options.attrIndex;
      const attrField = options.attrField;

      setFormState((prev) => {
        const updatedVariants = [...prev.variants];

        if (
          attrIndex !== undefined &&
          attrField &&
          updatedVariants[variantIndex]?.attributes[attrIndex]
        ) {
          updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
        } else {
          if (name !== "attributes") {
            (updatedVariants[variantIndex] as any)[name] = value;

            // Recalculate selling price for variants
            // if (name === "price" || name === "offer") {
            //   const price = name === "price" ? safeNum(value, 0) : updatedVariants[variantIndex].price;
            //   const offer = name === "offer" ? safeNum(value, 0) : (updatedVariants[variantIndex].offer || 0);
            //   updatedVariants[variantIndex].sellingPrice = computeSellingPrice(price, offer);
            // }
            // if (name === "price" || name === "sellingPrice") {
            //   const price =
            //     name === "price"
            //       ? safeNum(value, 0)
            //       : updatedVariants[variantIndex].price;

            //   const sellingPrice =
            //     name === "sellingPrice"
            //       ? safeNum(value, 0)
            //       : updatedVariants[variantIndex].sellingPrice;

            //   updatedVariants[variantIndex].offer =
            //     price > 0
            //       ? Math.round(((price - sellingPrice) / price) * 100)
            //       : 0;
            // }

            if (name === "price" || name === "sellingPrice") {

  const price =
    name === "price"
      ? safeNum(value, 0)
      : safeNum(updatedVariants[variantIndex].price, 0);

  let sellingPrice =
    name === "sellingPrice"
      ? safeNum(value, 0)
      : safeNum(
          updatedVariants[variantIndex].sellingPrice,
          0
        );

  // ✅ Prevent negative value
  if (sellingPrice < 0) {
    sellingPrice = 0;
  }

  // ✅ Selling price cannot exceed price
  if (sellingPrice > price) {
    sellingPrice = price;
  }

  updatedVariants[variantIndex].sellingPrice =
    sellingPrice;

  updatedVariants[variantIndex].offer =
    price > 0
      ? Math.round(
          ((price - sellingPrice) / price) * 100
        )
      : 0;
}
          }
        }

        return { ...prev, variants: updatedVariants };
      });

      return;
    }

    setFormState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  // ✅ Variant management
  const toggleVariants = () => {
    setShowVariants((prev) => !prev);
    if (!showVariants && formState.variants.length === 0) {
      addVariant();
    }
  };

  const addVariant = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          price: 0,
          sellingPrice: 0,
          stock: 0,
          offer: 0,
          attributes: [{ key: "", value: "" }]
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setFormState(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // ✅ Attribute management
  const addAttribute = (vIndex: number) => {
    setFormState((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIndex].attributes.push({ key: "", value: "" });
      return { ...prev, variants: updatedVariants };
    });
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    setFormState(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes =
        updatedVariants[variantIndex].attributes.filter((_, i) => i !== attrIndex);
      return { ...prev, variants: updatedVariants };
    });
  };

  // ✅ Image management
  // const handleRemoveImage = (index: number) => {
  //   if (!formState.images[index] || !selectedProduct?.images) return;

  //   const imgObj = selectedProduct.images[index];
  //   if (imgObj && typeof imgObj === 'object' && "id" in imgObj) {
  //     setFormState(prev => ({
  //       ...prev,
  //       removedImageIds: [...prev.removedImageIds, (imgObj as { id: number }).id],
  //       images: prev.images.filter((_, i) => i !== index),
  //     }));
  //   } else {
  //     setFormState(prev => ({
  //       ...prev,
  //       images: prev.images.filter((_, i) => i !== index),
  //     }));
  //   }
  // };

  const handleRemoveImage = (index: number) => {

  setFormState(prev => {

    const imageToRemove =
      prev.images[index];

    if (!imageToRemove) return prev;

    return {

      ...prev,

      removedImageIds:
        imageToRemove.id
          ? [
              ...prev.removedImageIds,
              imageToRemove.id
            ]
          : prev.removedImageIds,

      images: prev.images.filter(
        (_, i) => i !== index
      ),

    };

  });

};

  const handleRemoveNewImage = (index: number) => {
    setFormState(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles = filesArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setFormState(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...validFiles],
    }));
  };

  // ✅ Calculate final price for base product
  // const calculateFinalPrice = (): number => {
  //   if (!formState.data) return 0;

  //   const originalPrice = safeNum(formState.data.originalPrice, 0);
  //   const offer = safeNum(formState.data.offer, 0);

  //   return computeSellingPrice(originalPrice, offer);
  // };

  console.log(formState.data?.returnPolicy)
  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.data) {
      toast.error("Form data not initialized");
      return;
    }

    // Validation
    if (!formState.data.name?.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formState.data.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!showVariants && formState.data.originalPrice <= 0) {
      toast.error("Original price must be greater than 0");
      return;
    }

    if (showVariants) {
      const invalidVariant = formState.variants.find(v =>
        !v.sku?.trim() || v.price <= 0 || v.stock < 0
      );

      if (invalidVariant) {
        toast.error("All variants must have SKU, valid price, and stock");
        return;
      }
    }

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      const sanitizedVariants = formState.variants
        .filter(v => v.sku || v.price || v.stock)
        .map((v) => ({
          id: v.id,
          sku: v.sku?.trim() ?? "",
          price: safeNum(v.price, 0),
          sellingPrice: safeNum(
            v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
            computeSellingPrice(v.price, v.offer ?? 0)
          ),
          offer: safeNum(v.offer ?? 0, 0),
          stock: safeNum(v.stock, 0),
          attributes: (v.attributes || [])
            .filter(a => a.key?.trim() && a.value?.trim())
            .map((a) => ({
              key: a.key?.trim() ?? "",
              value: a.value?.trim() ?? ""
            })),
        }));

      const hasVariants = showVariants && sanitizedVariants.length > 0;
      const productData = new FormData();

      // Append all form fields
      productData.append("name", formState.data.name?.trim() || "");
      productData.append("description", formState.data.description?.trim() || "");
      productData.append("slug", formState.data.slug?.trim() || "");
      productData.append("categoryId", String(formState.data.categoryId ?? 0));
      //   productData.append("subCategoryId", String(formState.data.subCategoryId || ""));
      if (formState.data.subCategoryId)
        productData.append("subCategoryId", formState.data.subCategoryId);

      productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
      // productData.append("originalPrice", String(formState.data.originalPrice ?? 0));
      // productData.append("offer", String(formState.data.offer ?? 0));
      productData.append("originalPrice", String(formState.data.originalPrice || 0));
      productData.append("finalPrice", String(formState.data.finalPrice || 0));
      // productData.append("price", String(hasVariants ? 0 : calculateFinalPrice()));
      //       productData.append(
      //   "price",
      //   String(
      //     hasVariants
      //       ? 0
      //       : calculateFinalPrice(
      //           Number(formState.data?.originalPrice || 0),
      //           Number(formState.data?.offer || 0)
      //         )
      //   )
      // );
      productData.append(
        "price",
        String(hasVariants ? 0 : formState.data.finalPrice || 0)
      );
      productData.append("material", formState.data.material?.trim() || "");
      productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
      productData.append("length", String(formState.data.length ?? 0));
      productData.append("height", String(formState.data.height ?? 0));
      productData.append("width", String(formState.data.width ?? 0));
      productData.append("weight", String(formState.data.weight ?? 0));
      productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
      productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
      productData.append("skuCode", formState.data.skuCode?.trim() || "");
      productData.append("returnPolicy", formState.data.returnPolicy?.trim() || "");
      productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
      productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
      productData.append("hasVariants", String(hasVariants));
      productData.append("isActive", String(isActive));
      productData.append("keywords", JSON.stringify(formState.data.keywords || []));

      if (hasVariants) {
        productData.append("variants", JSON.stringify(sanitizedVariants));
      }

      // Append removed image IDs
      if (formState.removedImageIds.length > 0) {
        productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
      }

      // Append new images
      formState.newImages.forEach((file) => {
        // productData.append("imageUrl", file);
        productData.append("images", file);
      });

      const updatedProduct = await updateProductById(formState.data.id, productData);
      // await updateProductGroup(
      //   formState.data.id,
      //   selectedVariants.map(v => v.id)
      // );
      if (selectedVariants.length > 0) {
        await updateProductGroup(
          formState.data.id,
          selectedVariants.map(v => v.id)
        );
      }

      // Update Redux
      const updatedList = products.map((p) =>
        p.id === formState.data.id ? updatedProduct : p
      );
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(updatedProduct));

      toast.success("✅ Product updated successfully!");

      // Reset temporary states
      setFormState(prev => ({
        ...prev,
        newImages: [],
        removedImageIds: [],
        loading: false,
      }));

    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(`❌ ${err.message || "Update failed"}`);
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  // ✅ Loading state
  if (!formState.data || options.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className="sr-only">Toggle Status</span>
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Basic Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <Label>Product Name<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your product name"
                      value={formState.data?.name || ""}
                      onChange={handleChange}

                    />
                  </div>
                  <div>
                    <Label>SKU Code<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="skuCode"
                      placeholder="Enter SKU code"
                      value={formState.data?.skuCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Material<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="material"
                      placeholder="Enter material"
                      value={formState.data?.material || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Dimensions</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Length<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="length"
                        placeholder="Enter length"
                        value={formState.data?.length || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Width<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="width"
                        placeholder="Enter width"
                        value={formState.data?.width || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Height<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="height"
                        placeholder="Enter height"
                        value={formState.data?.height || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Weight<span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        name="weight"
                        placeholder="Enter weight"
                        value={formState.data?.weight || ""}
                        onChange={handleChange}
                        className="w-full"
                        min="0"
                      />
                      <select
                        name="weightUnit"
                        value={formState.data?.weightUnit || "kg"}
                        onChange={handleChange}
                        className="border rounded px-2 py-3 text-sm"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Policies</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Label>Return Policy</Label>
                    {/* <Select
                      options={returnPolicyOptions}
                      placeholder="Select Return Policy"
                      value={formState.data?.returnPolicy}
                      onChange={(value) => setFormState(prev => ({
                        ...prev,
                        data: { ...prev.data, returnPolicy: value }
                      }))}
                    /> */}
                    <Select
                      key={formState.data?.returnPolicy}
                      options={returnPolicyOptions}
                      placeholder="Select Return Policy"
                      value={formState.data?.returnPolicy || ""}
                      onChange={(value: string) =>
                        setFormState((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            returnPolicy: value,
                          },
                        }))
                      }
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <Label>Warranty Info</Label>
                    <TextArea
                      name="warrantyInfo"
                      placeholder="e.g., 1-year replacement warranty"
                      value={formState.data?.warrantyInfo || ""}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Type */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Type</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <select
                      name="categoryId"
                      value={formState.data?.categoryId || ""}
                      // onChange={handleCategoryChange}

                      onChange={handleCategoryChange}
                      className="w-full border rounded-lg p-3 text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {options.categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {filteredSubCategory.length > 0 && (
                    <div>
                      <Label>SubCategory</Label>
                      <select
                        name="subCategoryId"
                        value={formState.data?.subCategoryId || ""}
                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                        className="w-full border rounded-lg p-3"
                      >
                        <option value="">Select SubCategory</option>
                        {filteredSubCategory.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {options.subCategoryChildren.length > 0 && (
  <div>
    <Label>Child Category</Label>

    <select
      name="childSubCategoryId"
      value={formState.data?.childSubCategoryId || ""}
      onChange={handleChange}
      className="w-full border rounded-lg p-3"
    >
      <option value="">
        Select Child Category
      </option>

      {options.subCategoryChildren.map((child) => (
        <option
          key={child.value}
          value={child.value}
        >
          {child.label}
        </option>
      ))}
    </select>
  </div>
)}

                </div>
              </div>

              {/* Pricing */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Pricing</h2>
                </div>
                <div className="p-4 space-y-4">
                  {!showVariants && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Original Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="originalPrice"
                          placeholder="Original Price"
                          type="number"
                          min="0"
                          value={formState.data?.originalPrice || 0}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label>Final Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="finalPrice"
                          type="number"
                          min="0"
                          // value={formState.data?.price || 0}
                          value={formState.data?.finalPrice || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label>Offer %</Label>
                        <Input
                          type="number"
                          value={calculateOfferPercentage(
                            Number(formState.data?.originalPrice),
                            // Number(formState.data?.price)
                            Number(formState.data?.finalPrice)
                          )}
                          {...({ readOnly: true } as any)}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!showVariants && (
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          name="stock"
                          placeholder="Enter Stock"
                          value={formState.data?.stock || 0}
                          onChange={handleChange}

                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="shippingAvailable"
                        id="shippingAvailable"
                        checked={formState.data?.shippingAvailable || false}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="shippingAvailable" className="text-sm">
                        Free Shipping Available
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Pack Quantity
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    name="packQuantity"
                    value={formState.data?.packQuantity || 0}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />

                  {/* Optional badge */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    optional
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Number of items included in one pack
                </p>
              </div>
              {/* Tags */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Tags</h2>
                </div>
                <div className="p-4">
                  <div>
                    <Label>Keywords (Tags)</Label>
                    <ChipInput
                      value={formState.data?.keywords || []}
                      onChange={(keywords) => setFormState(prev => ({
                        ...prev,
                        data: { ...prev.data, keywords }
                      }))}
                      placeholder="Add keywords"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700">Details</h2>
            </div>
            <div className="p-4">
              <Label>Product Description</Label>
              <TextArea
                name="description"
                placeholder="Enter description"
                value={formState.data?.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          {/* Product Images - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700">Product Images</h2>
            </div>
            <div className="p-4">
              <Label>Upload Product Images <span className="text-red-500">*</span></Label>

              <div className="mt-4 flex flex-wrap gap-4">
                {/* Existing Images */}
                {formState.images.map((img, index) => (
                  <div key={`existing-${index}`} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                    {/* <img
                      // src={img}
                      // src={img.trim()}
                     
                      alt={`product-${index}`}
                      className="w-full h-full object-cover"
                    /> */}
                    <img
  src={
    typeof img === "string"
      ? img
      : img?.imageUrl ||
        img?.large ||
        img?.medium ||
        img?.thumbnail ||
        "/no-image.png"
  }
  alt={`product-${index}`}
  className="w-full h-full object-cover"
/>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}

                {/* New Images */}
                {formState.newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative w-32 h-32 border-2 border-green-300 rounded-lg overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      New
                    </span>
                  </div>
                ))}

                {/* Upload Button */}
                {(formState.images.length + formState.newImages.length) < 10 && (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImages}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Variants - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Variants</h2>
              <button
                type="button"
                onClick={toggleVariants}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                {showVariants ? (
                  <>
                    <HiX className="w-4 h-4 mr-1" /> Remove Variants
                  </>
                ) : (
                  <>
                    <HiPlus className="w-4 h-4 mr-1" /> Add Variants
                  </>
                )}
              </button>
            </div>

            {showVariants && (
              <div className="p-4">
                {formState.variants.map((variant, vIndex) => (
                  <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
                    {formState.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(vIndex)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        title="Remove variant"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <Label>SKU<span className="text-red-500">*</span></Label>
                        <Input
                          name="sku"
                          value={variant.sku}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>

                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          name="stock"
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>


                      <div className="flex gap-2">
                        <div>
                          <Label>Price<span className="text-red-500">*</span></Label>
                          <Input
                            name="price"
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                        <div>
                          <Label>Offer %</Label>
                          <Input
                            type="number"
                            value={
                              variant.price && variant.sellingPrice
                                ? Math.round(
                                  ((variant.price - variant.sellingPrice) / variant.price) * 100
                                )
                                : 0
                            }
                            {...({ readOnly: true } as any)}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <Label>Selling Price</Label>
                          <Input
                            name="sellingPrice"
                            type="number"
                            value={variant.sellingPrice || 0}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>

                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-end">
                          <div className="flex-1">
                            <Label>Key</Label>
                            <Input
                              value={attr.key}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "key",
                              })}
                              placeholder="e.g., Color"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              value={attr.value}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "value",
                              })}
                              placeholder="e.g., Red"
                            />
                          </div>

                          {variant.attributes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAttribute(vIndex, aIndex)}
                              className="text-red-500 hover:text-red-700 mb-1"
                              title="Remove attribute"
                            >
                              <HiX className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addAttribute(vIndex)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
                      >
                        <HiPlus className="w-4 h-4 mr-1" /> Add Attribute
                      </button>
                    </div>
                  </div>
                ))}




                <button
                  type="button"
                  onClick={addVariant}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  <HiPlus className="w-5 h-5 mr-1" /> Add Variant
                </button>
              </div>
            )}
          </div>



          <div className="w-full max-w-4xl">
            {/* 🔍 SEARCH */}
            <Input
              placeholder="Search SKU..."
              value={skuSearch}
              onChange={(e) => handleSkuSearch(e.target.value)}
            />

            {/* 🔽 DROPDOWN */}
            {searchResults.length > 0 && (
              <div className="border rounded mt-2 bg-white shadow max-h-60 overflow-y-auto">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAddVariant(p)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {/* <img
                      src={p.images?.[0]?.imageUrl || "/no-image.png"}
                      className="w-10 h-10 rounded"
                    /> */}
                    <img
  src={p.images?.[0]?.imageUrl || "/no-image.png"}
  alt={p.name || "Product"}
  className="w-10 h-10 rounded"
/>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.skuCode}</p>
                    </div>

                    <span className="text-blue-600 text-sm">Add</span>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ SELECTED */}
            {selectedVariants.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {selectedVariants.map((v) => (
                  <div key={v.id} className="border p-2 rounded">
                    {/* <img
                      src={v.images?.[0]?.imageUrl || "/no-image.png"}
                      className="h-24 w-full object-cover rounded"
                    /> */}
                   <img
  src={
    v.images?.[0]?.large ||
    v.images?.[0]?.medium ||
    v.images?.[0]?.thumbnail ||
    v.images?.[0]?.imageUrl ||
    "/no-image.png"
  }
  alt={v.name || "Variant Product"}
  className="h-24 w-full object-cover rounded"
/>

                    <p className="text-sm font-medium mt-1">{v.name}</p>

                    <button
                      onClick={() => handleRemoveVariant(v.id)}
                      className="text-red-500 text-xs mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={formState.loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState.loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                "Update Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;