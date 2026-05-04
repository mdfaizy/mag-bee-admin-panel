"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
import { HiChevronDown, HiPlus, HiUpload, HiX } from 'react-icons/hi';
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { SubCategory, CategoryOption } from "@/components/types/category";
import { apiConnector } from "@/services/apiConnector";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { calculateFinalPrice,calculateOfferPercentage } from "@/utils/priceUtils";
import { ProductFormData, productSchema } from "@/validations/product.schema";

const parseNumber = (v: any) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const num = Number(v);
  return isNaN(num) ? undefined : num;
};

export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);

  const [nestedLevels, setNestedLevels] = useState<SubCategory[][]>([]);
const [selectedNestedIds, setSelectedNestedIds] = useState<string[]>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  // const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(false);
const [skuSearch, setSkuSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  getValues,
  formState: { errors },
  trigger,
  setError,
  clearErrors
} = useForm<ProductFormData>({
  // resolver: zodResolver(productSchema),
  resolver: zodResolver(productSchema) as any, 
  mode: "onChange",
  defaultValues: {
    name: "",
    categoryId: "",
    description: "",
    material: "",
    keywords: [],
    price: undefined,
    originalPrice: undefined,
    offer: undefined,
    length: "",
    width: "",
    height: "",
    weight: "",
     packQuantity: undefined,
    weightUnit: "kg",
    stock: undefined,
    shippingAvailable: false,
    skuCode: "",
    returnPolicy: "",
    warrantyInfo: "",
    hasVariants: false,
    variants: [],
  },
});

  // const watchOriginalPrice = watch("originalPrice");
  // const watchOffer = watch("offer");
  const watchOriginalPrice = watch("originalPrice");
const watchFinalPrice = watch("price");
  const watchHasVariants = watch("hasVariants");
  const watchVariants = watch("variants");

  // Update showVariants state when hasVariants changes
  useEffect(() => {
    setShowVariants(watchHasVariants);
  }, [watchHasVariants]);



const handleSkuSearch = async (value: string) => {
  setSkuSearch(value);

  if (value.length < 2) return;

  const res = await apiConnector(
    "GET",
    `/search?sku=${value}`
  );

  setSearchResults(res.data.products);
};

const [selectedVariants, setSelectedVariants] = useState<any[]>([]);

const handleAddVariant = (product: any) => {
  // ❌ duplicate avoid
  if (selectedVariants.some(v => v.id === product.id)) return;

  setSelectedVariants(prev => [...prev, product]);
};
  // Initialize variants when toggling on
  useEffect(() => {
    if (watchHasVariants && (!watchVariants || watchVariants.length === 0)) {
      setValue("variants", [{
        sku: "",
        price: undefined,
        sellingPrice: undefined,
        stock: undefined,
        offer: undefined,
        attributes: [{ key: "", value: "" }],
      }]);
    }
  }, [watchHasVariants, setValue, watchVariants]);

  // Field array for variants
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  // Field array for attributes within variants
  const addAttribute = (variantIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    setValue(`variants.${variantIndex}.attributes`, [...currentAttributes, { key: "", value: "" }]);
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    setValue(`variants.${variantIndex}.attributes`, currentAttributes.filter((_, i) => i !== attrIndex));
  };

  // Calculate selling price for variant
  // const updateVariantSellingPrice = (variantIndex: number, price: number, offer: number = 0) => {
  //   const sellingPrice = calculateOfferPercentage(price, offer);
  //   setValue(`variants.${variantIndex}.sellingPrice`, sellingPrice);
  // };
  const updateOfferFromSelling = (
  variantIndex: number,
  price: number,
  sellingPrice: number
) => {
  const offer = calculateOfferPercentage(price, sellingPrice); // ✅ correct
  setValue(`variants.${variantIndex}.offer`, offer);
};

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", "/category");
        const categories = Array.isArray(res.data?.categories) ? res.data.categories : [];
        const formatted = categories.map((item: any) => ({
          value: String(item.id),
          label: item.name,
        }));
        setCategory(formatted);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      try {
        const data = await fetchSubCategoryAll();
        const formatted = data.map((item: any) => ({
          value: String(item.id),
          label: item.name,
          categoryId: String(item.category.id),
        }));
        setSubCategory(formatted);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    };
    fetchAllSubCategories();
  }, []);

  // Filter subcategories when category changes
  // const handleCategoryChange = (value: string) => {
  //   setValue("categoryId", value);
  //   setValue("subCategoryId", "");
  //   setValue("childSubCategoryId", "");
  //   const filtered = subCategory.filter(sc => sc.categoryId === value);
  //   setFilteredSubCategory(filtered);
  //   setSubCategoryChildren([]);
  //   trigger("categoryId");
  // };


  const handleCategoryChange = (value: string) => {
  setValue("categoryId", value);
  setValue("subCategoryId", "");
  setFilteredSubCategory(
    subCategory.filter(
      (sc) => sc.categoryId === value
    )
  );

  setNestedLevels([]);
  setSelectedNestedIds([]);

  trigger("categoryId");
};

  // Fetch children subcategories
  // const fetchChildren = async (parentId: string) => {
  //   try {
  //     const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
  //     const children = Array.isArray(res.data.children) ? res.data.children : res.data;
  //     const formatted = children.map((item: any) => ({
  //       value: String(item.id),
  //       label: item.name,
  //       parentId: String(parentId),
  //     }));
  //     setSubCategoryChildren(formatted);
  //   } catch (error) {
  //     console.error("Failed to fetch subcategory children:", error);
  //     setSubCategoryChildren([]);
  //   }
  // };

  const fetchNestedChildren = async (
  parentId: string,
  level: number
) => {
  try {
    const res = await apiConnector(
      "GET",
      `/subcategories/${parentId}/children`
    );

    const children = Array.isArray(
      res.data.children
    )
      ? res.data.children
      : [];

    const formatted = children.map(
      (item: any) => ({
        value: String(item.id),
        label: item.name,
      })
    );

    const updatedLevels = [
      ...nestedLevels.slice(0, level),
    ];

    if (formatted.length > 0) {
      updatedLevels.push(formatted);
    }

    setNestedLevels(updatedLevels);

    const updatedSelected = [
      ...selectedNestedIds.slice(
        0,
        level
      ),
    ];

    setSelectedNestedIds(
      updatedSelected
    );

    if (
      formatted.length === 0
    ) {
      setValue(
        "subCategoryId",
        parentId
      );
    }

  } catch (err) {
    console.error(err);
  }
};

  // Toggle variants
  const toggleVariants = () => {
    const newValue = !watchHasVariants;
    setValue("hasVariants", newValue, { shouldValidate: true });
    
    if (!newValue) {
      setValue("variants", []);
    }
  };


  
  // Check if variant SKU exists
  const checkVariantSkuExists = async (sku: string, index: number) => {
    if (!sku || sku.length < 3) return;
    
    try {
      const response = await apiConnector("GET", `/product/check-sku?variantSku=${sku}`);
      if (response.data.exists) {
        setError(`variants.${index}.sku`, { 
          type: "manual", 
          message: "This variant SKU already exists" 
        });
        return true;
      } else {
        clearErrors(`variants.${index}.sku`);
        return false;
      }
    } catch (error) {
      console.error("Error checking variant SKU:", error);
      return false;
    }
  };

  // Form submission
  // const onSubmit = async (data: ProductFormData) => {
  //   if (isSubmitting) return;

  //   // Validate images
  //   if (productImages.length === 0) {
  //     toast.error("Please upload at least one image");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   const toastId = toast.loading("Creating product...");

  //   try {
  //     // Prepare payload
  //     const payload: any = {
  //       name: data.name,
  //       skuCode: data.skuCode,
  //       material: data.material,
  //       description: data.description,
  //       categoryId: data.categoryId,
  //       subCategoryId: data.subCategoryId || null,
  //       childSubCategoryId: data.childSubCategoryId || null,
  //       length: data.length,
  //       width: data.width,
  //       height: data.height,
  //       weight: data.weight,
  //       weightUnit: data.weightUnit,
  //       returnPolicy: data.returnPolicy || null,
  //       warrantyInfo: data.warrantyInfo || null,
  //       keywords: JSON.stringify(data.keywords),
  //       shippingAvailable: data.shippingAvailable, // Boolean rahne do
  //       hasVariants: data.hasVariants, // Boolean rahne do
  //       isActive: isActive,
  //     };

  //     // Handle pricing based on variants
  //     if (data.hasVariants) {
  //       payload.originalPrice = null;
  //       payload.price = null;
  //       payload.stock = null;
  //       payload.offer = null;
        
  //       // Prepare variants - DON'T filter out based on SKU
  //       if (data.variants && data.variants.length > 0) {
  //         // const validVariants = data.variants.map(v => ({
  //         //   sku: v.sku, // SKU required
  //         //   price: Number(v.price || 0),
  //         //   sellingPrice: Number(v.sellingPrice || calculateFinalPrice(Number(v.price || 0), Number(v.offer || 0))),
  //         //   stock: Number(v.stock || 0),
  //         //   offer: Number(v.offer || 0),
  //         //   attributes: v.attributes.filter(a => a.key && a.value),
  //         // }));
  //         const validVariants = data.variants
  // .filter(v => v.sku && v.price !== undefined && v.stock !== undefined)
  // .map(v => ({
  //   sku: v.sku.trim(),
  //   price: Number(v.price),
  //   sellingPrice: Number(
  //     v.sellingPrice ??
  //     calculateFinalPrice(Number(v.price), Number(v.offer || 0))
  //   ),
  //   stock: Number(v.stock),
  //   offer: Number(v.offer || 0),
  //   attributes: v.attributes.filter(a => a.key && a.value),
  // }));
  //        console.log("VALID VARIANTS:", validVariants); 
  //         payload.variants = JSON.stringify(validVariants);
  //       }
  //     } else {
  //       payload.originalPrice = data.originalPrice || 0;
  //       payload.price = data.price || data.originalPrice || 0;
  //       payload.stock = data.stock || 0;
  //       payload.offer = data.offer || 0;
  //       payload.variants = null;
  //     }

  //     console.log("Final Payload:", payload);

  //     // Create FormData
  //     const form = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null) {
  //         form.append(key, value.toString());
  //       }
  //     });

  //     // Add images
  //     productImages.forEach(file => form.append("imageUrl", file));

  //     // API call
  //     const res = await apiConnector("POST", "/product", form);

  //     toast.dismiss(toastId);

  //     if (res.status === 201 || res.status === 200) {
  //       toast.success("✅ Product created successfully!");
  //       router.push("/");
  //     }
  //   } catch (error: any) {
  //     toast.dismiss(toastId);
  //     console.error("Product create error:", error);

  //     let message = "❌ Failed to create product";
      
  //     // Handle variant SKU errors
  //     if (error?.response?.data?.message?.includes("SKU")) {
  //       message = error.response.data.message;
        
  //       // Try to extract which SKU is duplicate
  //       const skuMatch = error.response.data.message.match(/SKU:?\s*([A-Z0-9-]+)/i);
  //       if (skuMatch && skuMatch[1]) {
  //         const duplicateSku = skuMatch[1];
  //         toast.error(`SKU "${duplicateSku}" already exists. Please use a different SKU.`);
  //       }
  //     } else if (error?.response?.data?.message) {
  //       message = error.response.data.message;
  //     } else if (error?.message) {
  //       message = error.message;
  //     }

  //     toast.error(message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

console.log("FUNC:", calculateOfferPercentage);
  const onSubmit = async (data: ProductFormData) => {
  if (isSubmitting) return;

  // ✅ Image validation
  if (productImages.length === 0) {
    toast.error("Please upload at least one image");
    return;
  }

  setIsSubmitting(true);
  const toastId = toast.loading("Creating product...");

  try {
    // ========================
    // ✅ BASE PAYLOAD
    // ========================
    // const payload: any = {
    //   name: data.name,
    //   skuCode: data.skuCode,
    //   material: data.material,
    //   description: data.description,
    //   categoryId: data.categoryId,
    //   subCategoryId: data.subCategoryId || null,
    //   childSubCategoryId: data.childSubCategoryId || null,
    //   length: data.length,
    //   width: data.width,
    //   height: data.height,
    //   weight: data.weight,
    //   weightUnit: data.weightUnit,
    //   returnPolicy: data.returnPolicy || null,
    //   warrantyInfo: data.warrantyInfo || null,
    //   keywords: JSON.stringify(data.keywords),
    //   shippingAvailable: data.shippingAvailable,
      // hasVariants: data.hasVariants,
    //   isActive: isActive,
    // };

    const payload: any = {
  name: data.name,
  skuCode: data.skuCode,
  material: data.material,
  description: data.description,
  categoryId: data.categoryId,
  subCategoryId: data.subCategoryId || null,
  childSubCategoryId: data.childSubCategoryId || null,
  length: data.length,
  width: data.width,
  height: data.height,
  weight: data.weight,
  weightUnit: data.weightUnit,
  returnPolicy: data.returnPolicy || null,
  warrantyInfo: data.warrantyInfo || null,
  keywords: JSON.stringify(data.keywords),
  shippingAvailable: data.shippingAvailable,
   packQuantity: data.packQuantity || 1,
  hasVariants: data.hasVariants,
  isActive: isActive,
};

// 🔥 ADD THIS BLOCK (MANDATORY)
// payload.originalPrice = data.originalPrice || 0;
// payload.price = data.price || data.originalPrice || 0;
// payload.stock = data.stock || 0;
// payload.offer = data.offer || 0;
// payload.variants = null;

const originalPrice = Number(data.originalPrice);
const finalPrice = Number(data.price);

// ✅ validation
if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
  toast.error("Invalid Original Price");
  setIsSubmitting(false);
  return;
}

if (!Number.isFinite(finalPrice) || finalPrice < 0) {
  toast.error("Invalid Final Price");
  setIsSubmitting(false);
  return;
}

// ✅ calculate offer
const offer = Math.round(
  ((originalPrice - finalPrice) / originalPrice) * 100
);

// ✅ assign payload
payload.originalPrice = originalPrice;
payload.price = finalPrice;
payload.offer = offer > 0 ? offer : 0;
payload.stock = data.stock || 0;
payload.variants = null;

    // ========================
    // ✅ VARIANTS HANDLING
    // ========================
    // if (data.hasVariants) {
    //   payload.originalPrice = null;
    //   payload.price = null;
    //   payload.stock = null;
    //   payload.offer = null;

    //   if (data.variants && data.variants.length > 0) {

    //     // ✅ FILTER + FORMAT
    //     const validVariants = data.variants
    //       .filter(v => v.sku && v.price !== undefined && v.stock !== undefined)
    //       .map(v => ({
    //         sku: v.sku.trim(),
    //         price: Number(v.price),
    //         sellingPrice: Number(
    //           v.sellingPrice ??
    //           calculateFinalPrice(Number(v.price), Number(v.offer || 0))
    //         ),
    //         stock: Number(v.stock),
    //         offer: Number(v.offer || 0),
    //         attributes: v.attributes.filter(a => a.key && a.value),
    //       }));

    //     console.log("VALID VARIANTS:", validVariants);

    //     // ========================
    //     // ✅ VALIDATION
    //     // ========================
    //     if (validVariants.length === 0) {
    //       toast.error("At least one valid variant required");
    //       setIsSubmitting(false);
    //       return;
    //     }

    //     const skuSet = new Set();

    //     for (const v of validVariants) {
    //       if (!v.sku || v.sku.trim() === "") {
    //         toast.error("SKU is required for all variants");
    //         setIsSubmitting(false);
    //         return;
    //       }

    //       if (skuSet.has(v.sku)) {
    //         toast.error(`Duplicate SKU in variants: ${v.sku}`);
    //         setIsSubmitting(false);
    //         return;
    //       }

    //       skuSet.add(v.sku);
    //     }

    //     payload.variants = JSON.stringify(validVariants);
    //   }

    // } else {
    //   // ========================
    //   // ✅ SIMPLE PRODUCT
    //   // ========================
    //   payload.originalPrice = data.originalPrice || 0;
    //   payload.price = data.price || data.originalPrice || 0;
    //   payload.stock = data.stock || 0;
    //   payload.offer = data.offer || 0;
    //   payload.variants = null;
    // }

    if (data.hasVariants) {
  payload.originalPrice = null;
  payload.price = null;
  payload.stock = null;
  payload.offer = null;

  if (data.variants && data.variants.length > 0) {

    const validVariants = data.variants
      .filter(v => v.sku && v.price !== undefined && v.stock !== undefined)
      .map(v => {
        const price = Number(v.price);
        const sellingPrice = Number(v.sellingPrice);

        // ✅ VALIDATION
        if (!Number.isFinite(price) || price <= 0) {
          throw new Error(`Invalid price for SKU: ${v.sku}`);
        }

        if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
          throw new Error(`Invalid selling price for SKU: ${v.sku}`);
        }

        if (sellingPrice > price) {
          throw new Error(`Selling price cannot be greater than price for SKU: ${v.sku}`);
        }

        // ✅ OFFER CALCULATE
        const offer = Math.round(((price - sellingPrice) / price) * 100);

        return {
          sku: v.sku.trim(),
          price,
          sellingPrice,
          stock: Number(v.stock),
          offer: offer > 0 ? offer : 0,
          attributes: v.attributes.filter(a => a.key && a.value),
        };
      });

    console.log("VALID VARIANTS:", validVariants);

    if (validVariants.length === 0) {
      toast.error("At least one valid variant required");
      setIsSubmitting(false);
      return;
    }

    const skuSet = new Set();

    for (const v of validVariants) {
      if (skuSet.has(v.sku)) {
        toast.error(`Duplicate SKU in variants: ${v.sku}`);
        setIsSubmitting(false);
        return;
      }
      skuSet.add(v.sku);
    }

    payload.variants = JSON.stringify(validVariants);
  }

} else {
  // ========================
  // ✅ SIMPLE PRODUCT FIXED
  // ========================

  const originalPrice = Number(data.originalPrice);
  const finalPrice = Number(data.price);

  // ✅ VALIDATION
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    toast.error("Invalid Original Price");
    setIsSubmitting(false);
    return;
  }

  if (!Number.isFinite(finalPrice) || finalPrice < 0) {
    toast.error("Invalid Final Price");
    setIsSubmitting(false);
    return;
  }

  if (finalPrice > originalPrice) {
    toast.error("Final price cannot be greater than original price");
    setIsSubmitting(false);
    return;
  }

  // ✅ OFFER CALCULATE
  const offer = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);

  payload.originalPrice = originalPrice;
  payload.price = finalPrice;
  payload.offer = offer > 0 ? offer : 0;
  payload.stock = Number(data.stock || 0);
  payload.variants = null;
}

    console.log("Final Payload:", payload);

    // ========================
    // ✅ FORM DATA FIX
    // ========================
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "variants") {
          form.append(key, value as string); // already JSON string
        } else {
          form.append(key, String(value));
        }
      }
    });

    // ✅ IMAGES
    productImages.forEach(file => {
      form.append("imageUrl", file);
    });

    // ========================
    // ✅ API CALL
    // ========================

    const res = await apiConnector("POST", "/product", form);
console.log("CREATE RES:", res.data);
console.log("SELECTED VARIANTS:", selectedVariants);
if (selectedVariants.length > 0 && res?.data?.product?.id) {
  try {
    await apiConnector("POST", "/group", {
      mainProductId: res.data.product.id,
      variantIds: selectedVariants.map(v => v.id),
    });

    console.log("✅ Variants grouped successfully");
  } catch (err) {
    console.error("❌ Grouping failed", err);
  }
}
    toast.dismiss(toastId);

    if (res.status === 201 || res.status === 200) {
      toast.success("✅ Product created successfully!");
      router.push("/");
    }

  } catch (error: any) {
    toast.dismiss(toastId);
    console.error("Product create error:", error);

    let message = "❌ Failed to create product";

    if (error?.response?.data?.message?.includes("SKU")) {
      message = error.response.data.message;

      const skuMatch = error.response.data.message.match(/SKU:?\s*([A-Z0-9-]+)/i);
      if (skuMatch && skuMatch[1]) {
        const duplicateSku = skuMatch[1];
        toast.error(`SKU "${duplicateSku}" already exists`);
        setIsSubmitting(false);
        return;
      }
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    toast.error(message);

  } finally {
    setIsSubmitting(false);
  }
};

console.log("✅ Variants grouped successfully");
  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
            <button
              type="button"
              onClick={() => setIsActive(prev => !prev)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-green-500" : "bg-gray-300"}`}
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                      {...register("name")}
                      placeholder="Enter your product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>SKU Code<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      {...register("skuCode")}
                      placeholder="Enter SKU code"
                      className={errors.skuCode ? "border-red-500" : ""}
                    />
                    {errors.skuCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.skuCode.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Material<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      {...register("material")}
                      placeholder="Enter material"
                      className={errors.material ? "border-red-500" : ""}
                    />
                    {errors.material && (
                      <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>
                    )}
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
                        {...register("length")}
                        placeholder="Enter length"
                        className={errors.length ? "border-red-500" : ""}
                      />
                      {errors.length && (
                        <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Width<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        {...register("width")}
                        placeholder="Enter width"
                        className={errors.width ? "border-red-500" : ""}
                      />
                      {errors.width && (
                        <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Height<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        {...register("height")}
                        placeholder="Enter height"
                        className={errors.height ? "border-red-500" : ""}
                      />
                      {errors.height && (
                        <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Weight<span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        {...register("weight")}
                        placeholder="Enter weight"
                        className={`w-full ${errors.weight ? "border-red-500" : ""}`}
                        min="0"
                      />
                      <select
                        {...register("weightUnit")}
                        className="border rounded px-2 py-3 text-sm"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
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
                    <Controller
                      name="returnPolicy"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={returnPolicyOptions}
                          placeholder="Select Return Policy"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <Label>Warranty Info</Label>
                    <TextArea
                      {...register("warrantyInfo")}
                      placeholder="e.g., 1-year replacement warranty"
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
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Label>Select category:<span className="ml-2 text-red-500">*</span></Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={category}
                          placeholder="Select Category"
                          onChange={(value) => {
                            field.onChange(value);
                            handleCategoryChange(value);
                          }}
                          value={field.value}
                          className={`appearance-none pr-10 ${errors.categoryId ? "border-red-500" : ""}`}
                        />
                      )}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>

                  {filteredSubCategory.length > 0 && (
                    <div className="relative">
                      <Label>Select sub-category:</Label>
                      <Controller
                        name="subCategoryId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={filteredSubCategory}
                            placeholder="Select SubCategory"
                            // onChange={(value) => {
                            //   field.onChange(value);
                            //   fetchChildren(value);
                            // }}
                            onChange={(value) => {
  field.onChange(value);

  setValue("subCategoryId", value);

  fetchNestedChildren(value, 0);
}}
                            value={field.value}
                            className="appearance-none pr-10"
                          />
                        )}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                  {nestedLevels.map(
  (levelOptions, levelIndex) => (
    <div
      key={levelIndex}
      className="relative"
    >
      <Label>
        Select Child SubCategory Level{" "}
        {levelIndex + 1}
      </Label>

      <Select
        options={levelOptions}
        placeholder={`Select Child Level ${
          levelIndex + 1
        }`}
        value={
          selectedNestedIds[
            levelIndex
          ] || ""
        }
        onChange={(value) => {
          const updated =
            [
              ...selectedNestedIds.slice(
                0,
                levelIndex
              ),
              value,
            ];

          setSelectedNestedIds(
            updated
          );

          setValue(
            "subCategoryId",
            value
          );

          fetchNestedChildren(
            value,
            levelIndex + 1
          );
        }}
      />
    </div>
  )
)}  
                </div>
              </div>

              {/* Pricing - Conditional based on hasVariants */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Pricing</h2>
                </div>
                <div className="p-4 space-y-4">
                  {!watchHasVariants && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Original Price<span className="text-red-500">*</span></Label>
                          <Input
                            type="number"
                            {...register("originalPrice")}
  //                           {...register("originalPrice", {
  //   setValueAs: (v) => (v === "" ? undefined : Number(v)),
  // })}
  
                            placeholder="Original Price"
                            className={errors.originalPrice ? "border-red-500" : ""}
                          />
                          {errors.originalPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>
                          )}
                        </div>

                       <div>
  <Label>Offer %</Label>
  <Input
    type="number"
    value={calculateOfferPercentage(
      Number(watchOriginalPrice || 0),
      Number(watchFinalPrice || 0)
    )}
    // readOnly
    className="bg-gray-100 cursor-not-allowed"
  />
</div>
                        <div>
                          <Label>Final Price</Label>
                          {/* <Input
                            type="number"
                            value={calculateFinalPrice(
                              Number(watchOriginalPrice || 0),
                              Number(watchOffer || 0)
                            )}
                           {...({ readOnly: true } as any)}
                            className="bg-gray-100 cursor-not-allowed"
                          /> */}
                          <Input
  type="number"
  {...register("price", {
    setValueAs: (v) => (v === "" ? undefined : Number(v)),
  })}
  placeholder="Final Price"
/>
                        </div>
                      </div>
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register("stock")}
                          {...register("stock", {
    setValueAs: (v) => (v === "" ? undefined : Number(v)),
  })}
                          placeholder="Enter Stock"
                          className={errors.stock ? "border-red-500" : ""}
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {/* <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("shippingAvailable")}
                      className="w-4 h-4"
                    />
                    <label className="text-sm">
                      Free Shipping Available
                    </label>
                  </div>

                  <label>Pack Quantity</label>
<input
  type="number"
  min={1}
  {...register("packQuantity", { valueAsNumber: true })}
  placeholder="Optional (e.g. 10)" */}
{/* /> */}
<div className="flex items-center justify-between p-4 border rounded-xl shadow-sm">
  <div>
    <p className="text-sm font-semibold text-gray-800">Free Shipping</p>
    <p className="text-xs text-gray-500">Enable delivery without extra charges</p>
  </div>
  <input
    type="checkbox"
    {...register("shippingAvailable")}
    className="w-5 h-5 text-blue-600"
  />
</div>
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700">
    Pack Quantity
  </label>

  <div className="relative">
    <input
      type="number"
      min={1}
      {...register("packQuantity", { valueAsNumber: true })}
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
                </div>
              </div>

              {/* Tags */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Tags</h2>
                </div>
                <div className="p-4">
                  <div>
                    <Label>Keywords (Tags)</Label>
                    <Controller
                      name="keywords"
                      control={control}
                      render={({ field }) => (
                        <ChipInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add keywords"
                        />
                      )}
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
            <div className="p-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Product Description <span className="text-red-500">*</span>
              </Label>
              <TextArea
                {...register("description")}
                placeholder="Write detailed product description (features, specifications, warranty, etc.)"
                rows={6}
                className={`w-full rounded-lg border p-3 text-sm 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                           resize-y min-h-[140px] ${errors.description ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Add full product details like features, specifications, material, warranty etc.
              </p>
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
                {productImages.map((file, index) => (
                  <div key={index} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`product-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 text-center">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        setProductImages(prev => [...prev, ...Array.from(files)]);
                      }
                    }}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
              {productImages.length === 0 && (
                <p className="text-red-500 text-sm mt-2">Please upload at least one image</p>
              )}
            </div>
          </div>

          {/* Variants Toggle - Full Width */}
        <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Variants</h2>
              <button
                type="button"
                onClick={toggleVariants}
                className={`text-sm font-medium flex items-center ${
                  watchHasVariants ? "text-red-600 hover:text-red-800" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {watchHasVariants ? (
                  <>
                    <HiX className="w-4 h-4 mr-1" /> Disable Variants
                  </>
                ) : (
                  <>
                    <HiPlus className="w-4 h-4 mr-1" /> Enable Variants
                  </>
                )}
              </button>
            </div>
            </div>
     {watchHasVariants && (
              <div className="p-4">
                {errors.variants && !Array.isArray(errors.variants) && (
                  <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                    {errors.variants.message}
                  </p>
                )}

                {variantFields.map((field, vIndex) => (
                  <div key={field.id} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
                    {variantFields.length > 1 && (
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
                          {...register(`variants.${vIndex}.sku`)}
                          className={errors.variants?.[vIndex]?.sku ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.sku && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.sku?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.stock`, {
  setValueAs: parseNumber,
})}
                          className={errors.variants?.[vIndex]?.stock ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.stock?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                      <div>
                        <Label>Price<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register(`variants.${vIndex}.price`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.price`, {
  setValueAs: parseNumber,
})}
                          // onChange={(e) => {
                          //   const price = Number(e.target.value);
                          //   const offer = watchVariants?.[vIndex]?.offer || 0;
                          //   setValue(`variants.${vIndex}.price`, price);
                          //   updateVariantSellingPrice(vIndex, price, offer);
                          // }}
//                           onChange={(e) => {
//   const value = parseNumber(e.target.value);
//   const offer = watchVariants?.[vIndex]?.offer || 0;

//   setValue(`variants.${vIndex}.price`, value);
//   updateVariantSellingPrice(vIndex, value || 0, offer);
// }}

onChange={(e) => {
  const value = parseNumber(e.target.value);
  const sellingPrice = watchVariants?.[vIndex]?.sellingPrice || 0;

  setValue(`variants.${vIndex}.price`, value);

  const offer = calculateOfferPercentage(value || 0, sellingPrice);
  setValue(`variants.${vIndex}.offer`, offer);
}}
                          className={errors.variants?.[vIndex]?.price ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.price?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Offer %</Label>
                        {/* <Input
                          type="number"
                          // {...register(`variants.${vIndex}.offer`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.offer`, {
  setValueAs: parseNumber,
})}
                          onChange={(e) => {
                            const offer = Number(e.target.value);
                            const price = watchVariants?.[vIndex]?.price || 0;
                            setValue(`variants.${vIndex}.offer`, offer);
                            updateVariantSellingPrice(vIndex, price, offer);
                          }}
                        /> */}

                           <Input
  type="number"
  value={calculateOfferPercentage(
  watchVariants?.[vIndex]?.price || 0,
  watchVariants?.[vIndex]?.sellingPrice || 0
)}
  {...({ readOnly: true } as any)} 
  className="bg-gray-100 cursor-not-allowed"
/>
                      </div>
                      <div>
                        <Label>Selling Price</Label>
                        <Input
                          type="number"
                          {...register(`variants.${vIndex}.sellingPrice`, {
  setValueAs: parseNumber,
})}
  onChange={(e) => {
    const selling = parseNumber(e.target.value);
    const price = watchVariants?.[vIndex]?.price || 0;

    setValue(`variants.${vIndex}.sellingPrice`, selling);

    const offer = calculateOfferPercentage(price, selling || 0);
setValue(`variants.${vIndex}.offer`, offer);
  }}

                          // {...register(`variants.${vIndex}.sellingPrice`, { valueAsNumber: true })}
                          // readOnly

// {...({ readOnly: true } as any)}                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>
                      {errors.variants?.[vIndex]?.attributes && (
                        <p className="text-red-500 text-sm mb-2">
                          {errors.variants[vIndex]?.attributes?.message}
                        </p>
                      )}
                      
                      {watchVariants?.[vIndex]?.attributes?.map((_, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-end">
                          <div className="flex-1">
                            <Label>Key</Label>
                            <Input
                              {...register(`variants.${vIndex}.attributes.${aIndex}.key`)}
                              placeholder="e.g., Color"
                              className={errors.variants?.[vIndex]?.attributes?.[aIndex]?.key ? "border-red-500" : ""}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              {...register(`variants.${vIndex}.attributes.${aIndex}.value`)}
                              placeholder="e.g., Red"
                              className={errors.variants?.[vIndex]?.attributes?.[aIndex]?.value ? "border-red-500" : ""}
                            />
                          </div>
                          {watchVariants[vIndex]?.attributes?.length > 1 && (
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
                  onClick={() => appendVariant({
                    sku: "",
                    // price: 0,
                    // sellingPrice: 0,
                    // stock: 0,
                     price: undefined,
  sellingPrice: undefined,
  stock: undefined,
                    attributes: [{ key: "", value: "" }],
                  })}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  <HiPlus className="w-5 h-5 mr-1" /> Add Variant
                </button>
              </div>
            )}
          


{/* <Input
  placeholder="Search SKU (e.g. MBSR)"
  value={skuSearch}
  onChange={(e) => handleSkuSearch(e.target.value)}
/>

{searchResults.length > 0 && (
  <div className="border rounded mt-2 p-2 max-h-60 overflow-y-auto bg-white shadow">
    {searchResults.map((p: any) => (
      <div
        key={p.id}
        className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
      >
        <div>
          <p className="font-medium">{p.name}</p>
          <p className="text-xs text-gray-500">{p.skuCode}</p>
        </div>

        <button
          type="button"
          onClick={() => handleAddVariant(p)}
          className="text-blue-600 text-sm"
        >
          Add
        </button>
      </div>
    ))}
  </div>
)}


{selectedVariants.length > 0 && (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">Selected Variants</h3>

    {selectedVariants.map((v) => (
      <div key={v.id} className="flex justify-between border p-2 mb-2">
        <span>{v.name}</span>

        <button
          onClick={() =>
            setSelectedVariants(prev =>
              prev.filter(p => p.id !== v.id)
            )
          }
          className="text-red-500"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)} */}

<div className="w-full max-w-4xl">
  {/* 🔍 Search Input */}
  <div className="relative">
    <Input
      placeholder="Search SKU (e.g. MBSR)"
      value={skuSearch}
      onChange={(e) => handleSkuSearch(e.target.value)}
      className="w-full"
    />

    {/* 🔽 Dropdown */}
    {searchResults.length > 0 && (
      <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
        {searchResults.map((p: any) => (
          <div
            key={p.id}
            onClick={() => handleAddVariant(p)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
          >
            {/* 🖼 Image */}
            <img
              src={p.imageUrl || "https://via.placeholder.com/40"}
              alt={p.name}
              className="w-10 h-10 rounded object-cover border"
            />

            {/* 📦 Info */}
            <div className="flex-1">
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-gray-500">{p.skuCode}</p>
            </div>

            <span className="text-blue-600 text-sm font-medium">
              Add
            </span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* ✅ Selected Products (CARD GRID UI) */}
  {selectedVariants.length > 0 && (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {selectedVariants.map((v: any) => (
        <div
          key={v.id}
          className="border rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white"
        >
          {/* Image */}
          <img
            src={v.imageUrl || "https://via.placeholder.com/150"}
            alt={v.name}
            className="w-full h-32 object-cover rounded-md mb-2"
          />

          {/* Info */}
          <div>
            <p className="font-semibold text-sm text-gray-800 line-clamp-1">
              {v.name}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              SKU: {v.skuCode}
            </p>
          </div>

          {/* Action */}
          <button
            onClick={() =>
              setSelectedVariants((prev) =>
                prev.filter((p) => p.id !== v.id)
              )
            }
            className="w-full text-center text-red-500 text-sm border border-red-200 rounded-md py-1 hover:bg-red-50 transition"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}
</div>
          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Return policy options
const returnPolicyOptions = [
  { value: "7-day return", label: "7-day return" },
  { value: "30-day return", label: "30-day return" },
  { value: "No return", label: "No return" },
];