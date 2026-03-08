"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
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
import { calculateFinalPrice } from "@/utils/priceUtils"
import { productSchema ,ProductFormData} from "@/validations/product.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
type Variant = {
  sku: string;
  // price: string;
  // offer:string;
  // sellingPrice: string;
  // stock: string;
  price: number;
  sellingPrice: number;
  stock: number;
  offer?: number;
  attributes: { key: string; value: string }[];
};
export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);


  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   setValue,
  //   watch
  // } = useForm<ProductFormData>({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     variants: []   // ⭐ IMPORTANT
  //   }
  // });

//   const {
//   register,
//   handleSubmit,
//   formState: { errors },
//   setValue,
//   watch
// } = useForm<ProductFormData>({
//   resolver: zodResolver(productSchema),
//   defaultValues: {
//     variants: []
//   }
// });


const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
  watch
} = useForm<ProductFormData>({
  // resolver: zodResolver(productSchema),
  resolver: zodResolver(productSchema) as any,
  defaultValues: {
    variants: []
  }
});

  // const [formData, setFormData] = useState({
  //   name: "",
  //   categoryId: "",
  //   description: "",
  //   material: "",
  //   keywords: [] as string[],
  //   price: "",
  //   originalPrice: "",
  //   offer: "",
  //   length: "",
  //   width: "",
  //   height: "",
  //   weight: "",
  //   weightUnit: "kg",
  //   stock: "",
  //   shippingAvailable: false,
  //   skuCode: "",
  //   returnPolicy: "",
  //   warrantyInfo: "",
  //   variants: [
  //     {
  //       sku: "",
  //       price: 0,
  //       sellingPrice: 0,
  //       stock: 0,
  //       attributes: [{ key: "", value: "" }],
  //     },
  //   ] as Variant[],
  // });

  const [formData, setFormData] = useState({
    keywords: [] as string[],
    variants: [
      {
        sku: "",
        price: 0,
        sellingPrice: 0,
        stock: 0,
        offer: 0,
        attributes: [{ key: "", value: "" }],
      },
    ] as Variant[],
  });
  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", "/category");
        console.log("res", res);
        const categories = Array.isArray(res.data?.categories)
          ? res.data.categories
          : [];
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

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
    const filtered = subCategory.filter(sc => sc.categoryId === value);
    setFilteredSubCategory(filtered);
    setSubCategoryChildren([]);
  };

  const toggleVariants = () => {
    setShowVariants((prev) => !prev);
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };
  const fetchChildren = async (parentId: string) => {
    try {
      const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
      const children = Array.isArray(res.data.children) ? res.data.children : res.data;
      const formatted = children.map((item: any) => ({
        value: String(item.id),
        label: item.name,
        parentId: String(parentId),
      }));

      setSubCategoryChildren(formatted);
    } catch (error) {
      console.error("Failed to fetch subcategory children:", error);
      setSubCategoryChildren([]);
    }
  };
  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    setFormData(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes =
        updatedVariants[variantIndex].attributes.filter((_, i) => i !== attrIndex);
      return { ...prev, variants: updatedVariants };
    });
  };
  const computeSellingPrice = (price: number, discount: number): number => {
    const final = price - (price * discount) / 100;
    return Math.max(0, Math.round(final));
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    options?: {
      variantIndex?: number;
      attrIndex?: number;
      attrField?: "key" | "value";
    }
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    // ================= VARIANT HANDLING =================
    if (options?.variantIndex !== undefined) {
      const variantIndex = options.variantIndex;
      const attrIndex = options.attrIndex;
      const attrField = options.attrField;

      setFormData((prev) => {
        const updatedVariants = [...prev.variants];

        // ✅ attribute update
        if (
          attrIndex !== undefined &&
          attrField &&
          updatedVariants[variantIndex]?.attributes[attrIndex]
        ) {
          updatedVariants[variantIndex].attributes[attrIndex][attrField] =
            value;
        } else {
          // ✅ normal field update
          if (name !== "attributes") {
            (updatedVariants[variantIndex] as any)[name] = value;

            // 🔥 AUTO RECALCULATE (PRODUCTION MUST)
            if (name === "price" || name === "offer") {
              const price =
                name === "price"
                  ? Number(value)
                  : Number(updatedVariants[variantIndex].price);

              const offer =
                name === "offer"
                  ? Number(value)
                  : Number(updatedVariants[variantIndex].offer || 0);

              updatedVariants[variantIndex].sellingPrice =
                computeSellingPrice(price, offer);
            }
          }
        }

        return { ...prev, variants: updatedVariants };
      });

      return;
    }

    // ================= NORMAL FIELD =================
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const originalPrice = watch("originalPrice");
  const offer = watch("offer");


  const variants = watch("variants");

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createEmptyVariant = (): Variant => ({
    sku: "",
    price: 0,
    sellingPrice: 0,
    stock: 0,
    offer: 0,
    attributes: [{ key: "", value: "" }],
  });

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };


  const addAttribute = (variantIndex: number) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes.push({ key: "", value: "" });
      return { ...prev, variants: updatedVariants };
    });
  };
  //sumbit function
  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (isSubmitting) return;
  //     if (!formData.originalPrice && !showVariants) {
  //       toast.error("Original price is required");  
  //       return;
  //     }
  // setIsSubmitting(true);
  //   const toastId = toast.loading("Creating product...");
  //     const variants = formData.variants
  //       .filter(v => v.sku || v.price || v.stock)
  //       .map(v => ({
  //         ...v,
  //         price: Number(v.price) || 0,
  //         stock: Number(v.stock) || 0,
  //         attributes: v.attributes.filter(a => a.key || a.value),
  //       }));

  //     const payload = {
  //       ...formData,
  //       isActive: isActive,
  //       //  hasVariants: showVariants && variants.length > 0, 
  //       hasVariants: showVariants && variants.length > 0,
  //       originalPrice: Number(formData.originalPrice),
  //       price: Number(formData.price) || (variants.length ? 0 : Number(formData.originalPrice)),
  //       offer: Number(formData.offer) || 0,
  //       stock: Number(formData.stock) || (variants.length ? 0 : Number(formData.stock)),
  //       variants: showVariants && variants.length > 0 ? JSON.stringify(variants) : undefined,
  //       shippingAvailable: String(formData.shippingAvailable),
  //       keywords: JSON.stringify(formData.keywords),
  //     };
  //     console.log("showVariants:", showVariants);
  //     console.log("variants after filtering:", variants);
  //     console.log("hasVariants value:", showVariants && variants.length > 0);
  //     console.log("variants length:", variants.length);
  //     console.log("showVariants:", showVariants);
  //     console.log("hasVariants to send:", variants.length > 0);

  //     const form = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       form.append(key, value !== undefined && value !== null ? value.toString() : "");
  //     });
  //     productImages.forEach((file) => form.append("imageUrl", file));
  //     try {
  //       const res = await apiConnector("POST", "/product"
  //         , form
  //       );
  //       //  dispatch(createProductThunk(payload, router));
  //       if (res.status === 201 || res.status === 200) {
  //        toast.success("✅ Product created successfully!");
  //        router.push("/");
  //       }
  //     } catch (error: any) {
  //       // console.error("Error submitting form:", error.response?.data || error.message);
  //       toast.error("Failed to create product");
  //     }catch (error: any) {
  //     toast.dismiss(toastId);
  //     console.error("Error submitting form:", error);
  //     toast.error(
  //       error?.response?.data?.message || "❌ Submission failed"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  //   };
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (isSubmitting) return;

  //   if (!formData.originalPrice && !showVariants) {
  //     toast.error("Original price is required");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   const toastId = toast.loading("Creating product...");

  //   try {
  //     const variants = formData.variants
  //       .filter(v => v.sku || v.price || v.stock)
  //       .map(v => ({
  //         ...v,
  //         price: Number(v.price) || 0,
  //         stock: Number(v.stock) || 0,
  //         attributes: v.attributes.filter(a => a.key || a.value),
  //       }));

  //     const payload = {
  //       ...formData,
  //       isActive: isActive,
  //       hasVariants: showVariants && variants.length > 0,
  //       originalPrice: Number(formData.originalPrice),
  //       price:
  //         Number(formData.price) ||
  //         (variants.length ? 0 : Number(formData.originalPrice)),
  //       offer: Number(formData.offer) || 0,
  //       stock:
  //         Number(formData.stock) ||
  //         (variants.length ? 0 : Number(formData.stock)),
  //       variants:
  //         showVariants && variants.length > 0
  //           ? JSON.stringify(variants)
  //           : undefined,
  //       shippingAvailable: String(formData.shippingAvailable),
  //       keywords: JSON.stringify(formData.keywords),
  //     };

  //     const form = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       form.append(
  //         key,
  //         value !== undefined && value !== null ? value.toString() : ""
  //       );
  //     });

  //     productImages.forEach(file => form.append("imageUrl", file));

  //     const res = await apiConnector("POST", "/product", form);

  //     toast.dismiss(toastId);

  //     if (res.status === 201 || res.status === 200) {
  //       toast.success("✅ Product created successfully!");
  //       router.push("/");
  //     } else {
  //       toast.error("Failed to create product");
  //     }
  //   } catch (error: any) {
  //     toast.dismiss(toastId);
  //     console.error("Error submitting form:", error);
  //     toast.error(
  //       error?.response?.data?.message || "❌ Submission failed"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  // const onSubmit = async (data: ProductFormData) => {
  //   try {

  //     const form = new FormData();

  //     Object.entries(data).forEach(([key, value]) => {
  //       form.append(key, JSON.stringify(value));
  //     });

  //     productImages.forEach(img => {
  //       form.append("imageUrl", img);
  //     });

  //     await apiConnector("POST", "/product", form);

  //     toast.success("Product created");

  //   } catch (error) {
  //     toast.error("Error creating product");
  //   }
  // };


  // const onSubmit = async (data: ProductFormData) => {

  //   try {

  //     // ✅ add this
  //     data.variantEnabled = showVariants;

  //     if (!showVariants) {
  //       delete data.variants;
  //     }

  //     const form = new FormData();

  //     Object.entries(data).forEach(([key, value]) => {

  //       if (value === undefined || value === null) return;

  //       if (Array.isArray(value)) {
  //         form.append(key, JSON.stringify(value));
  //       } else {
  //         form.append(key, String(value));
  //       }

  //     });

  //     productImages.forEach(img => {
  //       form.append("imageUrl", img);
  //     });

  //     await apiConnector("POST", "/product", form);

  //     toast.success("Product created successfully");

  //   } catch (error) {

  //     console.error(error);
  //     toast.error("Error creating product");

  //   }

  // };

  const onSubmit = async (data: ProductFormData) => {

    try {

      setIsSubmitting(true);

      (data as any).hasVariants = showVariants;
      (data as any).isActive = isActive;
      if (!showVariants) {
        delete data.variants;
      }

      const form = new FormData();

      Object.entries(data).forEach(([key, value]) => {

        if (value === undefined || value === null) return;

        if (typeof value === "object") {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value.toString());
        }

      });

      productImages.forEach((img) => {
        form.append("imageUrl", img);
      });

      await apiConnector(
        "POST",
        "/product",
        form,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      toast.success("Product created successfully");

    } catch (error) {

      console.error(error);
      toast.error("Error creating product");

    } finally {

      setIsSubmitting(false);

    }

  };

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
            {/* <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
            > */}
            {/* <button
  type="button"
  onClick={() => setIsActive(prev => !prev)}
  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
    isActive ? "bg-green-500" : "bg-gray-300"
  }`}
> */}
            <button
              type="button"
              onClick={() => setIsActive(prev => !prev)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-green-500" : "bg-gray-300"
                }`}
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

        {/* <form onSubmit={handleSubmit}> */}
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <form
          onSubmit={handleSubmit(
            onSubmit,
            (errors) => {
              console.log("VALIDATION ERRORS", errors);
            }
          )}
        >
          <input
            type="hidden"
            {...register("hasVariants")}
            value={showVariants ? "true" : "false"}
          />
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
                      // name="name"
                      placeholder="Enter your product name"
                      // value={formData.name}
                      {...register("name")}
                    // onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>SKU Code<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      // name="skuCode"
                      placeholder="Enter SKU code"
                      // value={formData.skuCode}
                      // onChange={handleChange}
                      {...register("skuCode")}
                    />
                    {errors.skuCode && (
                      <p className="text-red-500 text-sm">
                        {errors.skuCode.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Material<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      // name="material"
                      placeholder="Enter material"
                      // value={formData.material}
                      // onChange={handleChange}
                      {...register("material")}
                    />
                    {errors.material && (
                      <p className="text-red-500 text-sm">
                        {errors.material.message}
                      </p>
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
                        // name="length"
                        placeholder="Enter length"
                        // value={formData.length}
                        // onChange={handleChange}
                        {...register("length")}
                      />
                      {errors.length && (
                        <p className="text-red-500 text-sm">
                          {errors.length.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Width<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        // name="width"
                        placeholder="Enter width"
                        // value={formData.width}
                        // onChange={handleChange}
                        {...register("width")}
                      />
                      {errors.width && (
                        <p className="text-red-500 text-sm">
                          {errors.width.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Height<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        // name="height"
                        placeholder="Enter height"
                        // value={formData.height}
                        // onChange={handleChange}
                        {...register("height")}
                      />
                      {errors.height && (
                        <p className="text-red-500 text-sm">
                          {errors.height.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Weight<span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        // name="weight"
                        placeholder="Enter weight"
                        // value={formData.weight}
                        // onChange={handleChange}
                        {...register("weight")}
                        onChange={handleChange}
                        className="w-full"
                        min="0"
                      />
                      <select
                        // name="weightUnit"
                        // value={formData.weightUnit}
                        {...register("weightUnit")}
                        onChange={handleChange}
                        className="border rounded px-2 py-3 text-sm"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>

                    </div>
                    {errors.weight && (
                      <p className="text-red-500 text-sm">
                        {errors.weight.message}
                      </p>
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
                  {/* <div className="relative">
                    <Label>Return Policy</Label>
                    <Select
                      options={returnPolicyOptions}
                      placeholder="Select Return Policy"
                      onChange={(value) => handleSelectChange("returnPolicy", value)}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div> */}
                  <div className="relative">
                    <Label>
                      Return Policy<span className="text-red-500">*</span>
                    </Label>

                    <Select
                      options={returnPolicyOptions}
                      placeholder="Select Return Policy"
                      value={watch("returnPolicy")}
                      onChange={(value) => setValue("returnPolicy", value)}
                    />

                    {errors.returnPolicy && (
                      <p className="text-red-500 text-sm">
                        {errors.returnPolicy.message}
                      </p>
                    )}

                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <Label>Warranty Info</Label>
                    <TextArea
                      // name="warrantyInfo"
                      placeholder="e.g., 1-year replacement warranty"
                      // value={formData.warrantyInfo}
                      // onChange={handleChange}
                      {...register("warrantyInfo")}
                      rows={2}
                    />
                    {errors.warrantyInfo && (
                      <p className="text-red-500 text-sm">
                        {errors.warrantyInfo.message}
                      </p>
                    )}
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
                    {/* <Select
                      options={category}
                      placeholder="Select Category"
                      onChange={handleCategoryChange}
                      className="appearance-none pr-10"
                    /> */}
                    <Select
                      // name="categoryId"
                      options={category}
                      placeholder="Select Category"
                      // value={watch("categoryId")}

value={watch("categoryId")?.toString()}                      // onChange={(value) => {
                      //   setValue("categoryId", value);
                      //   // setValue("categoryId", Number(value));
                      //   handleCategoryChange(value);
                      // }}
                      onChange={(value) => {
                        setValue("categoryId", Number(value));
                        handleCategoryChange(value);
                      }}
                    />

                    {errors.categoryId && (
                      <p className="text-red-500 text-sm">
                        {errors.categoryId.message}
                      </p>
                    )}
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>

                  {filteredSubCategory.length > 0 && (
                    <div className="relative">
                      <Label>Select sub-category:<span className="ml-2 text-red-500">*</span></Label>
                      {/* <Select
                        options={filteredSubCategory}
                        placeholder="Select SubCategory"
                        // onChange={(value: string) => setFormData(prev => ({ ...prev, subCategoryId: value }))}
                        onChange={(value: string) => {
                          setFormData(prev => ({ ...prev, subCategoryId: value }));
                          fetchChildren(value); // fetch children on subcategory select
                        }}
                        className="appearance-none pr-10"
                      /> */}
                      <Select
                        // name="subCategoryId"
                        options={filteredSubCategory}
                        placeholder="Select SubCategory"
                        value={watch("subCategoryId")?.toString()}
                        // onChange={(value) => {
                        //   setValue("subCategoryId", value);
                        //   fetchChildren(value);
                        // }}
                        onChange={(value) => {
                          setValue("subCategoryId", Number(value));
                          fetchChildren(value);
                        }}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}



                  {subCategoryChildren.length > 0 && (
                    <div className="relative">
                      <Label>Select Sub Category Child:<span className="ml-2 text-red-500">*</span></Label>
                      {/* <Select
                        options={subCategoryChildren}
                        placeholder="Select Child SubCategory"
                        onChange={(value: string) =>
                          setFormData((prev) => ({ ...prev, childSubCategoryId: value }))
                        }

                      /> */}
                      <Select
                        // name="childSubCategoryId"
                        options={subCategoryChildren}
                        placeholder="Select Child SubCategory"
                        value={watch("childSubCategoryId")?.toString()}
                        // onChange={(value) =>
                        //   setValue("childSubCategoryId", value)
                        // }
                        onChange={(value) =>
                          setValue("childSubCategoryId", Number(value))
                        }
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
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
                        {/* <Input
                          name="originalPrice"
                          placeholder="Original Price"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleChange}
                        /> */}
                        <Input
                          type="number"
                          placeholder="Original Price"
                          {...register("originalPrice", { valueAsNumber: true })}
                        />

                        {errors.originalPrice && (
                          <p className="text-red-500 text-sm">
                            {errors.originalPrice.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Offer %<span className="text-red-500">*</span></Label>
                        {/* <Input
                          name="offer"
                          placeholder="Offer %"
                          type="number"
                          value={formData.offer}
                          onChange={handleChange}
                        /> */}
                        <Input
                          type="number"
                          placeholder="Offer %"
                          {...register("offer", { valueAsNumber: true })}
                        />

                        {errors.offer && (
                          <p className="text-red-500 text-sm">
                            {errors.offer.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Final Price<span className="text-red-500">*</span></Label>
                        {/* <Input
                          name="price"
                          placeholder="Final Price"
                          type="number"
                          // value={calculateFinalPrice().toFixed(2)}
//                          value={calculateFinalPrice(
//   Number(formData.originalPrice),
//   Number(formData.offer)
// )}
value={calculateFinalPrice(
  Number(originalPrice || 0),
  Number(offer || 0)
)}


                          // {...({ readOnly: true } as any)}
                          className="bg-gray-100 cursor-not-allowed"
                        /> */}
                        <Input
                          type="number"
                          // readOnly

{...({ readOnly: true } as any)}                          
value={calculateFinalPrice(
                            Number(originalPrice || 0),
                            Number(offer || 0)
                          )}
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!showVariants && (
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        {/* <Input
                          type="number"
                          // name="stock"
                          placeholder="Enter Stock"
                          // value={formData.stock}
                          // onChange={handleChange}
                          {...register("stock")}
                        />
                        {errors.stock && (
<p className="text-red-500 text-sm">
 {errors.stock.message}
</p>
)} */}
                        <Input
                          type="number"
                          placeholder="Enter Stock"
                          {...register("stock", { valueAsNumber: true })}
                        />

                        {errors.stock && (
                          <p className="text-red-500 text-sm">
                            {errors.stock.message}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        // name="shippingAvailable"
                        // id="shippingAvailable"
                        // checked={formData.shippingAvailable}
                        id="shippingAvailable"
                        {...register("shippingAvailable")}
                        // onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="shippingAvailable" className="text-sm">
                        Free Shipping Available
                      </label>
                    </div>
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
                    <ChipInput
                      value={formData.keywords}
                      onChange={(keywords) => setFormData(prev => ({ ...prev, keywords }))}
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
                // name="description"
                placeholder="Enter description"
                // value={formData.description}
                // onChange={handleChange}

                {...register("description")}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
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
                    name="imageUrl"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProductImages(prev => [...prev, file]);
                    }}
                    className="hidden"
                    multiple
                  />
                </label>
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
                {formData.variants.map((variant, vIndex) => (
                  <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
                    {formData.variants.length > 1 && (
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
                          // name="sku"
                          // value={variant.sku}
                          // onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          {...register(`variants.${vIndex}.sku`)}
                        />
                        {errors.variants?.[vIndex]?.sku && (
                          <p className="text-red-500 text-sm">
                            {errors.variants[vIndex].sku.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          // name="stock"
                          // value={variant.stock}
                          // onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })}
                        />
                        {errors.variants?.[vIndex]?.stock && (
                          <p className="text-red-500 text-sm">
                            {errors.variants[vIndex].stock.message}
                          </p>
                        )}
                      </div>

                      {/* <div className='flex grid grid-cols-1 md:grid-cols-3 gap-5 mb-5'>
                         <div>
                        <Label>Price<span className="text-red-500">*</span></Label>
                        <Input
                          // name="price"
                          type="number"
                          // value={variant.price}
                          // onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          {...register(`variants.${vIndex}.price`, { valueAsNumber: true })}
                           
                        />
                        {errors.variants?.[vIndex]?.price && (
<p className="text-red-500 text-sm">
 {errors.variants[vIndex].price.message}
</p>
)}
                      </div>
                      
<div>
  <Label>Offer %</Label>
  <Input
    // name="offer"
    type="number"
    // value={variant.offer || 0}
    // onChange={(e) => handleChange(e, { variantIndex: vIndex })}
    {...register(`variants.${vIndex}.offer`, { valueAsNumber: true })}
  />
  {errors.variants?.[vIndex]?.offer && (
    <p className="text-red-500 text-sm">
      {errors.variants[vIndex].offer.message}
    </p>
  )}
</div>
  <div>
  <Label>Selling Price<span className="text-red-500">*</span></Label>
  <Input
    // name="sellingPrice"
    type="number"
    // value={variant.sellingPrice}
    // onChange={(e) => handleChange(e, { variantIndex: vIndex })}
    {...register(`variants.${vIndex}.sellingPrice`, { valueAsNumber: true })}
  />
  {errors.variants?.[vIndex]?.sellingPrice && (
    <p className="text-red-500 text-sm">
      {errors.variants[vIndex].sellingPrice.message}
    </p>
  )}
</div>
                        </div> */}



                      {formData.variants.map((variant, vIndex) => {

                        const price = variants?.[vIndex]?.price || 0;
                        const offer = variants?.[vIndex]?.offer || 0;

                        return (
                          <div key={vIndex} className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">

                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                {...register(`variants.${vIndex}.price`, { valueAsNumber: true })}
                              />
                            </div>

                            <div>
                              <Label>Offer %</Label>
                              <Input
                                type="number"
                                {...register(`variants.${vIndex}.offer`, { valueAsNumber: true })}
                              />
                            </div>

                            <div>
                              <Label>Selling Price</Label>
                              <Input
                                type="number"
                                {...({ readOnly: true } as any)}
                                // readOnly
                                value={calculateFinalPrice(price, offer)}
                                {...register(`variants.${vIndex}.sellingPrice`, { valueAsNumber: true })}
                                className="bg-gray-100"
                              />


                            </div>

                          </div>
                        );

                      })}




                      {/* <div>
                        <Label>Selling Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="sellingPrice"
                          type="number"
                          value={variant.sellingPrice}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div> */}


                    </div>

                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>

                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-end">
                          <div className="flex-1">
                            <Label>Key</Label>
                            <Input
                              // value={attr.key}
                              // onChange={(e) => handleChange(e, {
                              //   variantIndex: vIndex,
                              //   attrIndex: aIndex,
                              //   attrField: "key",
                              // })}
                              {...register(`variants.${vIndex}.attributes.${aIndex}.key`)}
                              placeholder="e.g., Color"
                            />
                            {errors.variants?.[vIndex]?.attributes?.[aIndex]?.key && (
                              <p className="text-red-500 text-sm">
                                {errors.variants[vIndex].attributes[aIndex].key.message}
                              </p>
                            )}
                          </div>
                          {/* <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              // value={attr.value}
                              // onChange={(e) => handleChange(e, {
                              //   variantIndex: vIndex,
                              //   attrIndex: aIndex,
                              //   attrField: "value",
                              // })}
                              placeholder="e.g., Red"
                            />
                          </div> */}
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              placeholder="e.g., Red"
                              {...register(`variants.${vIndex}.attributes.${aIndex}.value`)}
                            />

                            {errors?.variants?.[vIndex]?.attributes?.[aIndex]?.value && (
                              <p className="text-red-500 text-sm">
                                {errors.variants[vIndex].attributes[aIndex].value?.message}
                              </p>
                            )}
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

          <div className="mt-8 text-center">
            {/* <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Submit
            </button> */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2
    ${isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
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


