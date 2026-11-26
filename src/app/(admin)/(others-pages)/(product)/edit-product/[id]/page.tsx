// // // "use client";
// // // import {
// // //   fetchProductsByGroup,
// // //   updateProductGroup
// // // } from "@/services/product/productService";
// // // import { toast } from "react-toastify";
// // // // import { useNavigate } from "react-router-dom";
// // // import { useParams, useRouter } from "next/navigation";
// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   getAllGstRatesAPI,
// // // } from "@/components/features/gst/service/gst.api";
// // // import Input from "../../../../../../components/form/input/InputField";
// // // import { HiChevronDown, HiX, HiPlus, HiUpload } from 'react-icons/hi';
// // // import Label from "../../../../../../components/form/Label";
// // // import TextArea from "@/components/form/input/TextArea";
// // // import RichTextEditor from "@/components/form/input/RichTextEditor";
// // // // import Select from "@/components/form/Select";
// // // import ChipInput from "@/components/form/input/ChipInput";
// // // import { useSelector, useDispatch } from "react-redux";
// // // import { RootState } from "@/redux/store";
// // // import { setSelectedProduct, setProducts } from "@/redux/productSlice";
// // // import { fetchProductById, updateProductById } from "@/services/product/productService";
// // // import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// // // import { Product, Variant } from "@/components/types/product";
// // // import { apiConnector } from "@/services/apiConnector";
// // // import { calculateOfferPercentage } from "@/utils/priceUtils"
// // // import ReturnReplacementPolicyFields from "@/components/products/ReturnReplacementPolicyFields";
// // // import {
// // //   PolicyErrors,
// // //   ReturnReplacementPolicy,
// // //   policyFromProduct,
// // //   policyToPayload,
// // //   validateReturnPolicy,
// // // } from "@/validations/returnPolicy";
// // // type ProductImageType = {
// // //   id: number;
// // //   imageUrl: string;
// // //   thumbnail?: string;
// // //   medium?: string;
// // //   large?: string;
// // // };
// // // type SubCategoryOption = {
// // //   value: string;
// // //   label: string;
// // //   categoryId: string;
// // // };
// // // type ProductLite = {
// // //   id: number;
// // //   name: string;
// // //   skuCode: string;
  
// // //   variantGroupId?: number;
// // //   // images?: { imageUrl: string }[];
// // //   images?: ProductImageType[];
// // // };

// // // // ✅ Utility functions
// // // const safeNum = (v: any, fallback = 0): number => {
// // //   const n = Number(v);
// // //   return isNaN(n) ? fallback : n;
// // // };

// // // const computeSellingPrice = (price: number, offer: number): number => {
// // //   const priceNum = safeNum(price, 0);
// // //   const offerNum = safeNum(offer, 0);
// // //   return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
// // // };

// // // // Current Return & Replacement values from the form data
// // // const policyFromForm = (data: any): ReturnReplacementPolicy => ({
// // //   returnEligible: data?.returnEligible === true,
// // //   returnWindowDays: Number(data?.returnWindowDays) || 0,
// // //   replacementEligible: data?.replacementEligible === true,
// // //   replacementWindowDays: Number(data?.replacementWindowDays) || 0,
// // //   returnPolicyConditions: data?.returnPolicyConditions ?? "",
// // // });

// // // const EditProductPage: React.FC = () => {
// // //   const dispatch = useDispatch();
// // //   const [policyErrors, setPolicyErrors] = useState<PolicyErrors>({});
// // //   const { id } = useParams();
// // //   const router = useRouter();

// // //   const { selectedProduct, products } = useSelector((state: RootState) => state.product);

// // //   // ✅ Consolidated state management
// // //   const [formState, setFormState] = useState({
// // //     data: null as any,
// // //     variants: [] as Variant[],
// // //     // images: [] as string[],
// // //    images: [] as ProductImageType[],
// // //     newImages: [] as File[],
// // //     removedImageIds: [] as number[],
// // //     loading: false,
// // //     initialized: false,
// // //   });
// // //   const [options, setOptions] = useState({
// // //     categories: [] as { value: string; label: string }[],
// // //     subCategories: [] as SubCategoryOption[], // ⭐ ADD THIS
// // //     subCategoryChildren: [] as { value: string; label: string }[],
// // //     loading: true,
// // //   });
// // //   const [skuSearch, setSkuSearch] = useState("");
// // //   const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
// // //   // const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);

// // //   // const [selectedVariants, setSelectedVariants] = useState<any[]>([]);
// // //   const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
// // //   const [showVariants, setShowVariants] = useState(false);
// // //   const [isActive, setIsActive] = useState(true);
// // //   const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);
// // //   const [gstRateOptions, setGstRateOptions] = useState<any[]>([]);

// // //   // ✅ Fetch product by ID on mount
// // //   useEffect(() => {
// // //     const loadProduct = async () => {
// // //       if (!id) return;

// // //       try {
// // //         const res = await fetchProductById(Number(id));
// // //         console.log('Product fetched:', res);
// // //         dispatch(setSelectedProduct(res.product));
// // //         setIsActive(res.product.isActive ?? true);
// // //       } catch (error) {
// // //         console.error('Failed to fetch product:', error);
// // //         toast.error('Failed to load product');
// // //       }
// // //     };

// // //     loadProduct();
// // //   }, [id, dispatch]);

// // //   const handleSkuSearch = async (value: string) => {
// // //     setSkuSearch(value);

// // //     if (value.length < 2) {
// // //       setSearchResults([]);
// // //       return;
// // //     }

// // //     try {
// // //       const res = await apiConnector("GET", `/search?sku=${value}`);

// // //       setSearchResults(res.data?.products || []);
// // //     } catch (err) {
// // //       console.error(err);
// // //       setSearchResults([]);
// // //     }
// // //   };
// // //   const handleAddVariant = (product: ProductLite) => {
// // //     if (selectedVariants.some(v => v.id === product.id)) {
// // //       toast.warning("Already added");
// // //       return;
// // //     }

// // //     setSelectedVariants(prev => [...prev, product]);

// // //     setSearchResults([]);
// // //     setSkuSearch("");
// // //   };

// // //   const handleRemoveVariant = (id: number) => {
// // //     setSelectedVariants(prev => prev.filter(p => p.id !== id));
// // //   };

// // //   // ✅ Fetch categories and subcategories
// // //   useEffect(() => {
// // //     const fetchOptionsData = async () => {
// // //       try {
// // //         setOptions(prev => ({ ...prev, loading: true }));

// // //         const categoriesRes = await apiConnector("GET", "/category");
// // //         const subCategoriesRes = await fetchSubCategoryAll();
// // // const [gstRes] = await Promise.all([
// // //   getAllGstRatesAPI(),
// // // ]);
// // // // GST options
// // // const gstList = gstRes.data?.data || [];
// // // setGstRateOptions(gstList.filter((item: any) => item.isActive));
// // //         const categories = Array.isArray(categoriesRes.data?.categories)
// // //           ? categoriesRes.data.categories
// // //           : [];

// // //         const formattedCategories = categories.map((cat: any) => ({
// // //           value: String(cat.id),
// // //           label: cat.name,
// // //         }));

// // //         const formattedSubCategories = subCategoriesRes.map((cat: any) => ({
// // //           value: String(cat.id),
// // //           label: cat.name,
// // //           categoryId: String(cat.category?.id || ''),
// // //         }));

// // //         setOptions(prev => ({
// // //           ...prev,
// // //           categories: formattedCategories,
// // //           subCategories: formattedSubCategories,
// // //           loading: false,
// // //         }));
// // //       } catch (err) {
// // //         console.error("Options fetch error", err);
// // //         toast.error("Failed to load categories and subcategories");
// // //         setOptions(prev => ({ ...prev, loading: false }));
// // //       }
// // //     };

// // //     fetchOptionsData();
// // //   }, []);

// // //   useEffect(() => {
// // //     const loadGroupProducts = async () => {
// // //       if (!selectedProduct?.variantGroupId) {
// // //         setSelectedVariants([]);
// // //         return;
// // //       }
// // //       try {
// // //         const products = await fetchProductsByGroup(
// // //           selectedProduct.variantGroupId
// // //         );
// // //         const others = products.filter(
// // //           (p: any) => p.id !== selectedProduct.id
// // //         );

// // //         setSelectedVariants(others);

// // //       } catch (err) {
// // //         console.error("Group load error", err);
// // //       }
// // //     };

// // //     loadGroupProducts();
// // //   }, [selectedProduct]);


// // // useEffect(() => {
// // //   if (!selectedProduct) return;
// // //   if (formState.initialized) return;

// // //   try {

// // //     // =========================
// // //     // ✅ Prepare variants
// // //     // =========================
// // //     const initialVariants: Variant[] =
// // //       (selectedProduct.variants || []).map(
// // //         (v: any) => {

// // //           const price = safeNum(v.price, 0);

// // //           const offer = safeNum(v.offer, 0);

// // //           const sellingPrice = safeNum(
// // //             v.sellingPrice,
// // //             computeSellingPrice(price, offer)
// // //           );

// // //           return {
// // //             id: v.id,
// // //             sku: v.sku ?? "",
// // //             price,
// // //             sellingPrice,
// // //             stock: safeNum(v.stock, 0),
// // //             offer,
// // //             attributes:
// // //               (v.attributes || []).length > 0
// // //                 ? v.attributes.map((a: any) => ({
// // //                     key: a.key ?? "",
// // //                     value: a.value ?? "",
// // //                   }))
// // //                 : [{ key: "", value: "" }],
// // //           };
// // //         }
// // //       );

// // //     // =========================
// // //     // ✅ Filter subcategories
// // //     // =========================
// // //     let filtered: any[] = [];

// // //     const categoryId =selectedProduct.category?.id;
// // //     if (categoryId) {
// // //       filtered =options.subCategories.filter((sc: any) =>sc.categoryId ===String(categoryId));
// // //     }
// // //     setFilteredSubCategory(filtered);
// // //     // =========================
// // //     // ✅ Fetch child category
// // //     // =========================
// // //     if (selectedProduct.subCategory?.id) {
// // //       fetchChildren(
// // //         String(selectedProduct.subCategory.id)
// // //       );
// // //     }
// // //     // =========================
// // //     // ✅ Set form state
// // //     // =========================
// // //     setFormState({
// // //       data: {
// // //         ...selectedProduct,
// // //         // hsnCode: String(selectedProduct.hsn?.id || ""),
// // //        gstRateId: String(selectedProduct.gstRate?.id || ""),
// // //         dimensionUnit: selectedProduct.dimensionUnit ?? "cm",

// // //         description: selectedProduct.description ?? "",

// // //         categoryId:selectedProduct.category? String(selectedProduct.category.id) : "",

// // //         subCategoryId:
// // //           selectedProduct.subCategory
// // //             ? String(
// // //                 selectedProduct.subCategory.id
// // //               )
// // //             : "",

// // //         childSubCategoryId:
// // //           selectedProduct.childSubCategory?.id
// // //             ? String(
// // //                 selectedProduct.childSubCategory.id
// // //               )
// // //             : "",

// // //         originalPrice: safeNum(
// // //           selectedProduct.originalPrice,
// // //           0
// // //         ),

// // //         finalPrice: safeNum(
// // //           selectedProduct.price,
// // //           0
// // //         ),
// // // // Return & Replacement: the product's saved values only (no assumed
// // // // defaults — previously a missing value became "Return ON, 7 days" and was
// // // // saved back on every edit)
// // // ...policyFromProduct(selectedProduct),

// // // cancelable: selectedProduct.cancelable ?? true,

// // // warrantyInfo: selectedProduct.warrantyInfo ?? "",
// // //       },

// // //       variants: initialVariants,

// // //       images:
// // //         selectedProduct.images || [],

// // //       newImages: [],
// // //       removedImageIds: [],
// // //       loading: false,
// // //       initialized: true,
// // //     });

// // //   } catch (error) {
// // //     console.error(
// // //       "Error initializing form data:",
// // //       error
// // //     );
// // //   }

// // // }, [
// // //   selectedProduct,
// // //   formState.initialized
// // // ]);

// // // useEffect(() => {

// // //   if (
// // //     formState.data?.categoryId &&
// // //     options.subCategories.length > 0
// // //   ) {

// // //     const filtered =
// // //       options.subCategories.filter(
// // //         (sc) =>
// // //           sc.categoryId ===
// // //           String(formState.data.categoryId)
// // //       );

// // //     setFilteredSubCategory(filtered);
// // //   }

// // // }, [
// // //   formState.data?.categoryId,
// // //   options.subCategories
// // // ]);

// // //   // ✅ Fetch subcategory children
// // //   const fetchChildren = async (parentId: string) => {
// // //     try {
// // //       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
// // //       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
// // //       const formatted = children.map((item: any) => ({
// // //         value: String(item.id),
// // //         label: item.name,
// // //         parentId: String(parentId),
// // //       }));

// // //       setOptions(prev => ({ ...prev, subCategoryChildren: formatted }));
// // //     } catch (error) {
// // //       console.error("Failed to fetch subcategory children:", error);
// // //       setOptions(prev => ({ ...prev, subCategoryChildren: [] }));
// // //     }
// // //   };
// // //   // ✅ Handle category change
// // //   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// // //     const value = e.target.value;

// // //     const filtered = options.subCategories.filter(
// // //       sc => sc.categoryId === value
// // //     );

// // //     setFilteredSubCategory(filtered);

// // //     setFormState(prev => ({
// // //       ...prev,
// // //       data: {
// // //         ...prev.data,
// // //         categoryId: value,
// // //         subCategoryId: "", // reset
// // //         childSubCategoryId: "",
// // //       }
// // //     }));
// // //   };
// // //   // ✅ Handle subcategory changeD
// // //   const handleSubCategoryChange = (value: string) => {
// // //     setFormState(prev => ({
// // //       ...prev,
// // //       data: {
// // //         ...prev.data,
// // //         subCategoryId: value,
// // //         childSubCategoryId: "",
// // //       },
// // //     }));
// // //     fetchChildren(value);
// // //   };

// // //   // ✅ Handle basic field changes
// // //   const handleChange = (
// // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
// // //     options?: {
// // //       variantIndex?: number;
// // //       attrIndex?: number;
// // //       attrField?: "key" | "value";
// // //     }
// // //   ) => {
// // //     const { name, value, type } = e.target;
// // //     const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

// // //     if (options?.variantIndex !== undefined) {
// // //       const variantIndex = options.variantIndex;
// // //       const attrIndex = options.attrIndex;
// // //       const attrField = options.attrField;

// // //       setFormState((prev) => {
// // //         const updatedVariants = [...prev.variants];

// // //         if (
// // //           attrIndex !== undefined &&
// // //           attrField &&
// // //           updatedVariants[variantIndex]?.attributes[attrIndex]
// // //         ) {
// // //           updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
// // //         } else {
// // //           if (name !== "attributes") {
// // //             (updatedVariants[variantIndex] as any)[name] = value;
// // //             if (name === "price" || name === "sellingPrice") {
// // //            const price = name === "price"? safeNum(value, 0): safeNum(updatedVariants[variantIndex].price, 0);
// // //             let sellingPrice =name === "sellingPrice"? safeNum(value, 0): safeNum(updatedVariants[variantIndex].sellingPrice,0);

// // //             // ✅ Prevent negative value
// // //             if (sellingPrice < 0) {
// // //               sellingPrice = 0;
// // //             }

// // //             // ✅ Selling price cannot exceed price
// // //             if (sellingPrice > price) {
// // //               sellingPrice = price;
// // //             }

// // //           updatedVariants[variantIndex].sellingPrice =
// // //             sellingPrice;

// // //           updatedVariants[variantIndex].offer =
// // //             price > 0
// // //               ? Math.round(
// // //                   ((price - sellingPrice) / price) * 100
// // //                 )
// // //               : 0;
// // //         }
// // //                   }
// // //                 }

// // //                 return { ...prev, variants: updatedVariants };
// // //               });

// // //             return;
// // //           }

// // //     setFormState((prev) => ({
// // //       ...prev,
// // //       data: {...prev.data,[name]: type === "checkbox" ? checked : value,},
// // //     }));
// // //   };

// // //   // ✅ Variant management
// // //   const toggleVariants = () => {
// // //     setShowVariants((prev) => !prev);
// // //     if (!showVariants && formState.variants.length === 0) {
// // //       addVariant();
// // //     }
// // //   };

// // //   const addVariant = () => {
// // //     setFormState((prev) => ({
// // //       ...prev,
// // //       variants: [
// // //         ...prev.variants,
// // //         {
// // //           sku: "",
// // //           price: 0,
// // //           sellingPrice: 0,
// // //           stock: 0,
// // //           offer: 0,
// // //           attributes: [{ key: "", value: "" }]
// // //         },
// // //       ],
// // //     }));
// // //   };

// // //   const removeVariant = (index: number) => {
// // //     setFormState(prev => ({
// // //       ...prev,
// // //       variants: prev.variants.filter((_, i) => i !== index),
// // //     }));
// // //   };

// // //   // ✅ Attribute management
// // //   const addAttribute = (vIndex: number) => {
// // //     setFormState((prev) => {
// // //       const updatedVariants = [...prev.variants];
// // //       updatedVariants[vIndex].attributes.push({ key: "", value: "" });
// // //       return { ...prev, variants: updatedVariants };
// // //     });
// // //   };

// // //   const removeAttribute = (variantIndex: number, attrIndex: number) => {
// // //     setFormState(prev => {
// // //       const updatedVariants = [...prev.variants];
// // //       updatedVariants[variantIndex].attributes =
// // //         updatedVariants[variantIndex].attributes.filter((_, i) => i !== attrIndex);
// // //       return { ...prev, variants: updatedVariants };
// // //     });
// // //   };

// // //   // ✅ Image management
// // //   const handleRemoveImage = (index: number) => {
// // //   setFormState(prev => {
// // //     const imageToRemove =
// // //       prev.images[index];
// // //     if (!imageToRemove) return prev;
// // //     return {
// // //       ...prev,
// // //       removedImageIds:
// // //         imageToRemove.id
// // //           ? [
// // //               ...prev.removedImageIds,
// // //               imageToRemove.id
// // //             ]
// // //           : prev.removedImageIds,
// // //       images: prev.images.filter(
// // //         (_, i) => i !== index
// // //       ),
// // //     };
// // //   });
// // // };

// // //   const handleRemoveNewImage = (index: number) => {
// // //     setFormState(prev => ({
// // //       ...prev,
// // //       newImages: prev.newImages.filter((_, i) => i !== index),
// // //     }));
// // //   };

// // //   const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (!e.target.files) return;

// // //     const filesArray = Array.from(e.target.files);
// // //     const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

// // //     if (totalImages > 10) {
// // //       toast.error("Maximum 10 images allowed");
// // //       return;
// // //     }

// // //     const validFiles = filesArray.filter(file => {
// // //       if (!file.type.startsWith('image/')) {
// // //         toast.error(`File ${file.name} is not an image`);
// // //         return false;
// // //       }
// // //       if (file.size > 5 * 1024 * 1024) {
// // //         toast.error(`Image ${file.name} is too large (max 5MB)`);
// // //         return false;
// // //       }
// // //       return true;
// // //     });

// // //     setFormState(prev => ({
// // //       ...prev,
// // //       newImages: [...prev.newImages, ...validFiles],
// // //     }));
// // //   };

// // //   // ✅ Handle form submission
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!formState.data) {
// // //       toast.error("Form data not initialized");
// // //       return;
// // //     }
// // //     // Validation
// // //     if (!formState.data.name?.trim()) {
// // //       toast.error("Product name is required");
// // //       return;
// // //     }
// // //     if (!formState.data.categoryId) {
// // //       toast.error("Category is required");
// // //       return;
// // //     }
// // //     if (!showVariants && formState.data.originalPrice <= 0) {
// // //       toast.error("Original price must be greater than 0");
// // //       return;
// // //     }
// // //     if (showVariants) {
// // //       const invalidVariant = formState.variants.find(v =>
// // //         !v.sku?.trim() || v.price <= 0 || v.stock < 0
// // //       );
// // //       if (invalidVariant) {
// // //         toast.error("All variants must have SKU, valid price, and stock");
// // //         return;
// // //       }
// // //     }
// // //     const policy = policyFromForm(formState.data);
// // //     const policyIssues = validateReturnPolicy(policy);
// // //     setPolicyErrors(policyIssues);
// // //     if (Object.keys(policyIssues).length > 0) {
// // //       toast.error(Object.values(policyIssues)[0] as string);
// // //       return;
// // //     }
// // //     setFormState(prev => ({ ...prev, loading: true }));
// // //     try {
// // //       const sanitizedVariants = formState.variants
// // //         .filter(v => v.sku || v.price || v.stock)
// // //         .map((v) => ({
// // //           id: v.id,
// // //           sku: v.sku?.trim() ?? "",
// // //           price: safeNum(v.price, 0),
// // //           sellingPrice: safeNum(
// // //             v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
// // //             computeSellingPrice(v.price, v.offer ?? 0)
// // //           ),
// // //           offer: safeNum(v.offer ?? 0, 0),
// // //           stock: safeNum(v.stock, 0),
// // //           attributes: (v.attributes || [])
// // //             .filter(a => a.key?.trim() && a.value?.trim())
// // //             .map((a) => ({
// // //               key: a.key?.trim() ?? "",
// // //               value: a.value?.trim() ?? ""
// // //             })),
// // //         }));

// // //       const hasVariants = showVariants && sanitizedVariants.length > 0;
// // //       const productData = new FormData();

// // //       // Append all form fields
// // //       productData.append("name", formState.data.name?.trim() || "");
// // //       productData.append("description", formState.data.description?.trim() || "");
// // //       productData.append("slug", formState.data.slug?.trim() || "");
// // //       productData.append("categoryId", String(formState.data.categoryId ?? 0));
// // //       //   productData.append("subCategoryId", String(formState.data.subCategoryId || ""));
// // //       if (formState.data.subCategoryId)
// // //         productData.append("subCategoryId", formState.data.subCategoryId);

// // //       productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
// // //       // productData.append("originalPrice", String(formState.data.originalPrice ?? 0));
// // //       // productData.append("offer", String(formState.data.offer ?? 0));
// // //       productData.append("originalPrice", String(formState.data.originalPrice || 0));
// // //       productData.append("finalPrice", String(formState.data.finalPrice || 0));
// // //       productData.append("hsnCode", String(formState.data.hsnCode));
// // //       productData.append("gstRateId", String(formState.data.gstRateId));
// // //       productData.append("price",String(hasVariants ? 0 : formState.data.finalPrice || 0));
// // //       productData.append("material", formState.data.material?.trim() || "");
// // //       productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
// // //       productData.append("length", String(formState.data.length ?? 0));
// // //       productData.append("height", String(formState.data.height ?? 0));
// // //       productData.append("width", String(formState.data.width ?? 0));
// // //       productData.append("weight", String(formState.data.weight ?? 0));
// // //       productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
// // //       productData.append("dimensionUnit",formState.data.dimensionUnit || "cm");
// // //       productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
// // //       productData.append("skuCode", formState.data.skuCode?.trim() || "");
// // //       // Return & Replacement (validated above; the API validates again)
// // //       Object.entries(policyToPayload(policy)).forEach(([key, value]) =>
// // //         productData.append(key, value)
// // //       );

// // //       productData.append("cancelable", String(formState.data.cancelable ?? true));

// // //       // appended once: a duplicate key made the API store "NO, NO"
// // //       productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
// // //       productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
// // //       productData.append("hasVariants", String(hasVariants));
// // //       productData.append("isActive", String(isActive));
// // //       productData.append("keywords", JSON.stringify(formState.data.keywords || []));

// // //       if (hasVariants) {
// // //         productData.append("variants", JSON.stringify(sanitizedVariants));
// // //       }

// // //       // Append removed image IDs
// // //       if (formState.removedImageIds.length > 0) {
// // //         productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
// // //       }

// // //       // Append new images
// // //       formState.newImages.forEach((file) => {
// // //         // productData.append("imageUrl", file);
// // //         productData.append("images", file);
// // //       });

// // //       const updatedProduct = await updateProductById(formState.data.id, productData);
// // //       // await updateProductGroup(
// // //       //   formState.data.id,
// // //       //   selectedVariants.map(v => v.id)
// // //       // );
// // //       if (selectedVariants.length > 0) {
// // //         await updateProductGroup(
// // //           formState.data.id,
// // //           selectedVariants.map(v => v.id)
// // //         );
// // //       }

// // //       // Update Redux
// // //       const updatedList = products.map((p) =>
// // //         p.id === formState.data.id ? updatedProduct : p
// // //       );
// // //       dispatch(setProducts(updatedList));
// // //       dispatch(setSelectedProduct(updatedProduct));

// // //       toast.success("✅ Product updated successfully!");
// // //       router.push("/product");
// // //       // Reset temporary states
// // //       setFormState(prev => ({
// // //         ...prev,
// // //         newImages: [],
// // //         removedImageIds: [],
// // //         loading: false,
// // //       }));

// // //     } catch (err: any) {
// // //       console.error("Update error:", err);
// // //       toast.error(`❌ ${err.message || "Update failed"}`);
// // //       setFormState(prev => ({ ...prev, loading: false }));
// // //     }
// // //   };

// // //   // ✅ Loading state
// // //   if (!formState.data || options.loading) {
// // //     return (
// // //       <div className="flex items-center justify-center min-h-screen">
// // //         <div className="text-center">
// // //           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// // //           <p className="text-gray-600 font-medium">Loading product...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
// // //       <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
// // //         <div className="flex justify-between items-center mb-6">
// // //           <h1 className="text-2xl font-bold">Edit Product</h1>
// // //           <div className="flex items-center gap-4">
// // //             <div className="flex items-center">
// // //               <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
// // //               <button  type="button" onClick={() => setIsActive(!isActive)}
// // //                 className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
// // //               >
// // //                 <span className="sr-only">Toggle Status</span>
// // //                 <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
// // //                 />
// // //               </button>
// // //               <span className="ml-2 text-sm font-medium text-gray-700">
// // //                 {isActive ? 'Active' : 'Inactive'}
// // //               </span>
// // //             </div>
// // //             <button
// // //               onClick={() => router.back()}
// // //               className="text-gray-600 hover:text-gray-800"
// // //             >
// // //               <HiX className="w-6 h-6" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         <form onSubmit={handleSubmit}>
// // //           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
// // //             {/* Left Column */}
// // //             <div className="space-y-6">
// // //               {/* Basic Information */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Basic Information</h2>
// // //                 </div>
// // //                 <div className="p-4 space-y-4">
// // //                   <div>
// // //                     <Label>Product Name<span className="text-red-500">*</span></Label>
// // //                     <Input
// // //                       type="text"
// // //                       name="name"
// // //                       placeholder="Enter your product name"
// // //                       value={formState.data?.name || ""}
// // //                       onChange={handleChange}

// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <Label>SKU Code<span className="text-red-500">*</span></Label>
// // //                     <Input
// // //                       type="text"
// // //                       name="skuCode"
// // //                       placeholder="Enter SKU code"
// // //                       value={formState.data?.skuCode || ""}
// // //                       onChange={handleChange}
// // //                     />
// // //                   </div>
// // //                   <div>
// // //                     <Label>Material<span className="text-red-500">*</span></Label>
// // //                     <Input
// // //                       type="text"
// // //                       name="material"
// // //                       placeholder="Enter material"
// // //                       value={formState.data?.material || ""}
// // //                       onChange={handleChange}
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Dimensions */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Dimensions</h2>
// // //                 </div>
// // //                 <div className="p-4 space-y-4">
// // //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                     <div>
// // //                       <Label>Length (cm)<span className="text-red-500">*</span></Label>
// // //                       <Input
// // //                         type="text"
// // //                         name="length"
// // //                         placeholder="Enter length"
// // //                         value={formState.data?.length || ""}
// // //                         onChange={handleChange}
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <Label>Width (cm)<span className="text-red-500">*</span></Label>
// // //                       <Input
// // //                         type="text"
// // //                         name="width"
// // //                         placeholder="Enter width"
// // //                         value={formState.data?.width || ""}
// // //                         onChange={handleChange}
// // //                       />
// // //                     </div>
// // //                     <div>
// // //                       <Label>Height (cm)<span className="text-red-500">*</span></Label>
// // //                       <Input
// // //                         type="text"
// // //                         name="height"
// // //                         placeholder="Enter height"
// // //                         value={formState.data?.height || ""}
// // //                         onChange={handleChange}
// // //                       />
// // //                     </div>
// // //                   </div>
// // //                   <div>
// // //                     <Label>Weight<span className="text-red-500">*</span></Label>
// // //                     <div className="flex items-center gap-2">
// // //                       <Input
// // //                         type="number"
// // //                         name="weight"
// // //                         placeholder="Enter weight"
// // //                         value={formState.data?.weight || ""}
// // //                         onChange={handleChange}
// // //                         className="w-full"
// // //                         min="0"
// // //                       />
// // //                       <select
// // //                         name="weightUnit"
// // //                         value={formState.data?.weightUnit || "kg"}
// // //                         onChange={handleChange}
// // //                         className="border rounded px-2 py-3 text-sm"
// // //                       >
// // //                         <option value="kg">kg</option>
// // //                         <option value="g">g</option>
// // //                       </select>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Policies */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Policies</h2>
// // //                 </div>
// // //                 {/* Return & Replacement */}
// // // <div className="p-4 space-y-5">
// // //   <ReturnReplacementPolicyFields
// // //     value={policyFromForm(formState.data)}
// // //     errors={policyErrors}
// // //     onChange={(patch) => {
// // //       setFormState((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
// // //       setPolicyErrors((prev) => {
// // //         const next = { ...prev };
// // //         (Object.keys(patch) as (keyof ReturnReplacementPolicy)[]).forEach((k) => delete next[k]);
// // //         return next;
// // //       });
// // //     }}
// // //   />

// // // {/* Cancellation */}
// // // <div className="flex items-start gap-2">
// // //   <input
// // //     id="cancelable"
// // //     type="checkbox"
// // //     name="cancelable"
// // //     checked={formState.data?.cancelable !== false}
// // //     onChange={handleChange}
// // //     className="mt-1 h-4 w-4"
// // //   />
// // //   <div>
// // //     <label htmlFor="cancelable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
// // //       Customer can cancel before dispatch
// // //     </label>
// // //     <p className="text-xs text-gray-500 mt-1">
// // //       When unchecked, customers cannot cancel an order that contains this product. Staff can still
// // //       cancel it with a reason.
// // //     </p>
// // //   </div>
// // // </div>

// // // {/* Warranty */}
// // // <div>
// // //   <Label>Warranty Info</Label>

// // //   <TextArea
// // //     name="warrantyInfo"
// // //     placeholder="e.g., 1-year manufacturer warranty"
// // //     value={formState.data?.warrantyInfo || ""}
// // //     onChange={handleChange}
// // //     rows={3}
// // //   />

// // //   <p className="text-xs text-gray-500 mt-1">
// // //     Enter warranty details if applicable.
// // //   </p>
// // // </div>
// // // </div>
// // //               </div>
// // //             </div>

// // //             {/* Right Column */}
// // //             <div className="space-y-6">
// // //               {/* Type */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Type</h2>
// // //                 </div>
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <Label>Category *</Label>
// // //                     <select
// // //                       name="categoryId"
// // //                       value={formState.data?.categoryId || ""}
// // //                       // onChange={handleCategoryChange}

// // //                       onChange={handleCategoryChange}
// // //                       className="w-full border rounded-lg p-3 text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                       required
// // //                     >
// // //                       <option value="">Select Category</option>
// // //                       {options.categories.map((cat) => (
// // //                         <option key={cat.value} value={cat.value}>
// // //                           {cat.label}
// // //                         </option>
// // //                       ))}
// // //                     </select>
// // //                   </div>
// // //                   {filteredSubCategory.length > 0 && (
// // //                     <div>
// // //                       <Label>SubCategory</Label>
// // //                       <select
// // //                         name="subCategoryId"
// // //                         value={formState.data?.subCategoryId || ""}
// // //                         onChange={(e) => handleSubCategoryChange(e.target.value)}
// // //                         className="w-full border rounded-lg p-3"
// // //                       >
// // //                         <option value="">Select SubCategory</option>
// // //                         {filteredSubCategory.map((sub) => (
// // //                           <option key={sub.value} value={sub.value}>
// // //                             {sub.label}
// // //                           </option>
// // //                         ))}
// // //                       </select>
// // //                     </div>
// // //                   )}
// // //                   {options.subCategoryChildren.length > 0 && (
// // //   <div>
// // //     <Label>Child Category</Label>

// // //     <select
// // //       name="childSubCategoryId"
// // //       value={formState.data?.childSubCategoryId || ""}
// // //       onChange={handleChange}
// // //       className="w-full border rounded-lg p-3"
// // //     >
// // //       <option value="">
// // //         Select Child Category
// // //       </option>

// // //       {options.subCategoryChildren.map((child) => (
// // //         <option
// // //           key={child.value}
// // //           value={child.value}
// // //         >
// // //           {child.label}
// // //         </option>
// // //       ))}
// // //     </select>
// // //   </div>
// // // )}

// // //                 </div>
// // //               </div>

// // //               {/* Pricing */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Pricing</h2>
// // //                 </div>
// // //                 <div className="p-4 space-y-4">
// // //                   {!showVariants && (
// // //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                       <div>
// // //                         <Label>Original Price<span className="text-red-500">*</span></Label>
// // //                         <Input
// // //                           name="originalPrice"
// // //                           placeholder="Original Price"
// // //                           type="number"
// // //                           min="0"
// // //                           value={formState.data?.originalPrice || 0}
// // //                           onChange={handleChange}
// // //                         />
// // //                       </div>
// // //                       <div>
// // //                         <Label>Final Price<span className="text-red-500">*</span></Label>
// // //                         <Input
// // //                           name="finalPrice"
// // //                           type="number"
// // //                           min="0"
// // //                           // value={formState.data?.price || 0}
// // //                           value={formState.data?.finalPrice || ""}
// // //                           onChange={handleChange}
// // //                         />
// // //                       </div>
// // //                       <div>
// // //                         <Label>Offer %</Label>
// // //                         <Input
// // //                           type="number"
// // //                           value={calculateOfferPercentage(
// // //                             Number(formState.data?.originalPrice),
// // //                             // Number(formState.data?.price)
// // //                             Number(formState.data?.finalPrice)
// // //                           )}
// // //                           {...({ readOnly: true } as any)}
// // //                           className="bg-gray-100 cursor-not-allowed"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   )}


// // // {/* HSN & GST */}
// // // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// // //   <div>
// // //     <Label>HSN Code *</Label>
// // //    <Input
// // //               name="hsnCode"
// // //                           placeholder="Hsn Code..."
// // //                           type="number"
// // //                           min="0"
// // //                           value={formState.data?.hsnCode || 0}
// // //                           onChange={handleChange}
                        
// // //                         />
// // //   </div>

// // //   <div>
// // //     <Label>GST Rate *</Label>

// // //     <select
// // //       name="gstRateId"
// // //       value={formState.data?.gstRateId || ""}
// // //       onChange={handleChange}
// // //       className="w-full border rounded-lg p-3"
// // //       required
// // //     >
// // //       <option value="">Select GST Rate</option>

// // //       {gstRateOptions.map((gst) => (
// // //         <option key={gst.id} value={gst.id}>
// // //           {gst.totalRate}%
// // //         </option>
// // //       ))}
// // //     </select>
// // //   </div>

// // // </div>
// // //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                     {!showVariants && (
// // //                       <div>
// // //                         <Label>Stock<span className="text-red-500">*</span></Label>
// // //                         <Input
// // //                           type="number"
// // //                           name="stock"
// // //                           placeholder="Enter Stock"
// // //                           value={formState.data?.stock || 0}
// // //                           onChange={handleChange}

// // //                         />
// // //                       </div>
// // //                     )}
                
// // //                     <div className="flex items-center justify-between p-4 border rounded-xl shadow-sm">
// // //   <div>
// // //     <p className="text-sm font-semibold text-gray-800">
// // //       Shipping Available
// // //     </p>

// // //     <p className="text-xs text-gray-500">
// // //       Allow this product to be delivered to customers
// // //     </p>
// // //   </div>

// // //   <input
// // //     type="checkbox"
// // //     name="shippingAvailable"
// // //     id="shippingAvailable"
// // //     checked={formState.data?.shippingAvailable ?? false}
// // //     onChange={handleChange}
// // //     className="w-5 h-5 text-blue-600"
// // //   />
// // // </div>

// // // <div className="border border-gray-200 rounded-lg">
// // //                     <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                       <h2 className="font-semibold text-gray-700">
// // //                         Shipping Settings
// // //                       </h2>
// // //                     </div>

// // //                     <div className="p-4 space-y-4">

// // //                       {/* COD AVAILABLE */}
// // //                       <div className="flex items-center justify-between p-3 border rounded-lg">
// // //                         <div>
// // //                           <p className="text-sm font-semibold text-gray-800">
// // //                             Cash on Delivery (COD)
// // //                           </p>
// // //                           <p className="text-xs text-gray-500">
// // //                             Allow customers to pay on delivery
// // //                           </p>
// // //                         </div>

// // //                         <input
// // //                           // type="checkbox"
// // //                           // {...register("codAvailable")}
// // //                           // className="w-5 h-5"
// // //                           type="checkbox"
// // //     name="codAvailable"
// // //     id="codAvailable"
// // //     checked={formState.data?.codAvailable ?? false}
// // //     onChange={handleChange}
// // //     className="w-5 h-5 text-blue-600"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <div className="flex flex-col gap-1">
// // //                 <label className="text-sm font-medium text-gray-700">
// // //                   Pack Quantity
// // //                 </label>

// // //                 <div className="relative">
// // //                   <input
// // //                     type="number"
// // //                     min={1}
// // //                     name="packQuantity"
// // //                     value={formState.data?.packQuantity || 0}
// // //                     onChange={handleChange}
// // //                     placeholder="e.g. 10"
// // //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
// // //                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
// // //                   />

// // //                   {/* Optional badge */}
// // //                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
// // //                     optional
// // //                   </span>
// // //                 </div>

// // //                 <p className="text-xs text-gray-500">
// // //                   Number of items included in one pack
// // //                 </p>
// // //               </div>
// // //               {/* Tags */}
// // //               <div className="border border-gray-200 rounded-lg">
// // //                 <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //                   <h2 className="font-semibold text-gray-700">Tags</h2>
// // //                 </div>
// // //                 <div className="p-4">
// // //                   <div>
// // //                     <Label>Keywords (Tags)</Label>
// // //                     <ChipInput
// // //                       value={formState.data?.keywords || []}
// // //                       onChange={(keywords) => setFormState(prev => ({
// // //                         ...prev,
// // //                         data: { ...prev.data, keywords }
// // //                       }))}
// // //                       placeholder="Add keywords"
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Description - Full Width */}
// // //           <div className="mt-6 border border-gray-200 rounded-lg">
// // //             <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //               <h2 className="font-semibold text-gray-700">Details</h2>
// // //             </div>
// // //             <div className="p-4">
// // //               <Label>Product Description</Label>
// // //               {/* <TextArea
// // //                 name="description"
// // //                 placeholder="Enter description"
// // //                 value={formState.data?.description || ""}
// // //                 onChange={handleChange}
// // //                 rows={4}
// // //               /> */}
// // //               <RichTextEditor
// // //   value={formState.data?.description || ""}
// // //   onChange={(value) =>
// // //     setFormState((prev) => ({
// // //       ...prev,
// // //       data: {
// // //         ...prev.data,
// // //         description: value,
// // //       },
// // //     }))
// // //   }
// // // />
// // //             </div>
// // //           </div>

// // //           {/* Product Images - Full Width */}
// // //           <div className="mt-6 border border-gray-200 rounded-lg">
// // //             <div className="bg-gray-100 p-3 border-b border-gray-200">
// // //               <h2 className="font-semibold text-gray-700">Product Images</h2>
// // //             </div>
// // //             <div className="p-4">
// // //               <Label>Upload Product Images <span className="text-red-500">*</span></Label>

// // //               <div className="mt-4 flex flex-wrap gap-4">
// // //                 {/* Existing Images */}
// // //                 {formState.images.map((img, index) => (
// // //                   <div key={`existing-${index}`} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
// // //                     {/* <img
// // //                       // src={img}
// // //                       // src={img.trim()}
                     
// // //                       alt={`product-${index}`}
// // //                       className="w-full h-full object-cover"
// // //                     /> */}
// // //                     <img
// // //   src={
// // //     typeof img === "string"
// // //       ? img
// // //       : img?.imageUrl ||
// // //         img?.large ||
// // //         img?.medium ||
// // //         img?.thumbnail ||
// // //         "/no-image.png"
// // //   }
// // //   alt={`product-${index}`}
// // //   className="w-full h-full object-cover"
// // // />
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => handleRemoveImage(index)}
// // //                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
// // //                     >
// // //                       <HiX className="w-4 h-4" />
// // //                     </button>
// // //                     {index === 0 && (
// // //                       <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
// // //                         Main
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 ))}

// // //                 {/* New Images */}
// // //                 {formState.newImages.map((file, index) => (
// // //                   <div key={`new-${index}`} className="relative w-32 h-32 border-2 border-green-300 rounded-lg overflow-hidden group">
// // //                     <img
// // //                       src={URL.createObjectURL(file)}
// // //                       alt={`new-${index}`}
// // //                       className="w-full h-full object-cover"
// // //                     />
// // //                     <button
// // //                       type="button"
// // //                       onClick={() => handleRemoveNewImage(index)}
// // //                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
// // //                     >
// // //                       <HiX className="w-4 h-4" />
// // //                     </button>
// // //                     <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
// // //                       New
// // //                     </span>
// // //                   </div>
// // //                 ))}

// // //                 {/* Upload Button */}
// // //                 {(formState.images.length + formState.newImages.length) < 10 && (
// // //                   <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
// // //                     <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
// // //                     <span className="text-sm text-gray-500 text-center">Upload Image</span>
// // //                     <input
// // //                       type="file"
// // //                       accept="image/*"
// // //                       onChange={handleAddImages}
// // //                       className="hidden"
// // //                       multiple
// // //                     />
// // //                   </label>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Variants - Full Width */}
// // //           <div className="mt-6 border border-gray-200 rounded-lg">
// // //             <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
// // //               <h2 className="font-semibold text-gray-700">Variants</h2>
// // //               <button
// // //                 type="button"
// // //                 onClick={toggleVariants}
// // //                 className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
// // //               >
// // //                 {showVariants ? (
// // //                   <>
// // //                     <HiX className="w-4 h-4 mr-1" /> Remove Variants
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <HiPlus className="w-4 h-4 mr-1" /> Add Variants
// // //                   </>
// // //                 )}
// // //               </button>
// // //             </div>

// // //             {showVariants && (
// // //               <div className="p-4">
// // //                 {formState.variants.map((variant, vIndex) => (
// // //                   <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
// // //                     {formState.variants.length > 1 && (
// // //                       <button
// // //                         type="button"
// // //                         onClick={() => removeVariant(vIndex)}
// // //                         className="absolute top-3 right-3 text-red-500 hover:text-red-700"
// // //                         title="Remove variant"
// // //                       >
// // //                         <HiX className="w-5 h-5" />
// // //                       </button>
// // //                     )}

// // //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
// // //                       <div>
// // //                         <Label>SKU<span className="text-red-500">*</span></Label>
// // //                         <Input
// // //                           name="sku"
// // //                           value={variant.sku}
// // //                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
// // //                         />
// // //                       </div>

// // //                       <div>
// // //                         <Label>Stock<span className="text-red-500">*</span></Label>
// // //                         <Input
// // //                           name="stock"
// // //                           type="number"
// // //                           value={variant.stock}
// // //                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
// // //                         />
// // //                       </div>


// // //                       <div className="flex gap-2">
// // //                         <div>
// // //                           <Label>Price<span className="text-red-500">*</span></Label>
// // //                           <Input
// // //                             name="price"
// // //                             type="number"
// // //                             value={variant.price}
// // //                             onChange={(e) => handleChange(e, { variantIndex: vIndex })}
// // //                           />
// // //                         </div>
// // //                         <div>
// // //                           <Label>Offer %</Label>
// // //                           <Input
// // //                             type="number"
// // //                             value={
// // //                               variant.price && variant.sellingPrice
// // //                                 ? Math.round(
// // //                                   ((variant.price - variant.sellingPrice) / variant.price) * 100
// // //                                 )
// // //                                 : 0
// // //                             }
// // //                             {...({ readOnly: true } as any)}
// // //                             className="bg-gray-100 cursor-not-allowed"
// // //                           />
// // //                         </div>
// // //                         <div>
// // //                           <Label>Selling Price</Label>
// // //                           <Input
// // //                             name="sellingPrice"
// // //                             type="number"
// // //                             value={variant.sellingPrice || 0}
// // //                             onChange={(e) => handleChange(e, { variantIndex: vIndex })}
// // //                           />
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                     <div className="mt-5">
// // //                       <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>

// // //                       {variant.attributes.map((attr, aIndex) => (
// // //                         <div key={aIndex} className="flex gap-3 mb-3 items-end">
// // //                           <div className="flex-1">
// // //                             <Label>Key</Label>
// // //                             <Input
// // //                               value={attr.key}
// // //                               onChange={(e) => handleChange(e, {
// // //                                 variantIndex: vIndex,
// // //                                 attrIndex: aIndex,
// // //                                 attrField: "key",
// // //                               })}
// // //                               placeholder="e.g., Color"
// // //                             />
// // //                           </div>
// // //                           <div className="flex-1">
// // //                             <Label>Value</Label>
// // //                             <Input
// // //                               value={attr.value}
// // //                               onChange={(e) => handleChange(e, {
// // //                                 variantIndex: vIndex,
// // //                                 attrIndex: aIndex,
// // //                                 attrField: "value",
// // //                               })}
// // //                               placeholder="e.g., Red"
// // //                             />
// // //                           </div>

// // //                           {variant.attributes.length > 1 && (
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => removeAttribute(vIndex, aIndex)}
// // //                               className="text-red-500 hover:text-red-700 mb-1"
// // //                               title="Remove attribute"
// // //                             >
// // //                               <HiX className="w-5 h-5" />
// // //                             </button>
// // //                           )}
// // //                         </div>
// // //                       ))}

// // //                       <button
// // //                         type="button"
// // //                         onClick={() => addAttribute(vIndex)}
// // //                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
// // //                       >
// // //                         <HiPlus className="w-4 h-4 mr-1" /> Add Attribute
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 ))}




// // //                 <button
// // //                   type="button"
// // //                   onClick={addVariant}
// // //                   className="text-green-600 hover:text-green-800 font-medium flex items-center"
// // //                 >
// // //                   <HiPlus className="w-5 h-5 mr-1" /> Add Variant
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>



// // //           <div className="w-full max-w-4xl">
// // //             {/* 🔍 SEARCH */}
// // //             <Input
// // //               placeholder="Search SKU..."
// // //               value={skuSearch}
// // //               onChange={(e) => handleSkuSearch(e.target.value)}
// // //             />

// // //             {/* 🔽 DROPDOWN */}
// // //             {searchResults.length > 0 && (
// // //               <div className="border rounded mt-2 bg-white shadow max-h-60 overflow-y-auto">
// // //                 {searchResults.map((p) => (
// // //                   <div
// // //                     key={p.id}
// // //                     onClick={() => handleAddVariant(p)}
// // //                     className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
// // //                   >
// // //                     {/* <img
// // //                       src={p.images?.[0]?.imageUrl || "/no-image.png"}
// // //                       className="w-10 h-10 rounded"
// // //                     /> */}
// // //                     <img
// // //   src={p.images?.[0]?.imageUrl || "/no-image.png"}
// // //   alt={p.name || "Product"}
// // //   className="w-10 h-10 rounded"
// // // />

// // //                     <div className="flex-1">
// // //                       <p className="text-sm font-medium">{p.name}</p>
// // //                       <p className="text-xs text-gray-500">{p.skuCode}</p>
// // //                     </div>

// // //                     <span className="text-blue-600 text-sm">Add</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             {/* ✅ SELECTED */}
// // //             {selectedVariants.length > 0 && (
// // //               <div className="mt-4 grid grid-cols-2 gap-3">
// // //                 {selectedVariants.map((v) => (
// // //                   <div key={v.id} className="border p-2 rounded">
// // //                     {/* <img
// // //                       src={v.images?.[0]?.imageUrl || "/no-image.png"}
// // //                       className="h-24 w-full object-cover rounded"
// // //                     /> */}
// // //                    <img
// // //   src={
// // //     v.images?.[0]?.large ||
// // //     v.images?.[0]?.medium ||
// // //     v.images?.[0]?.thumbnail ||
// // //     v.images?.[0]?.imageUrl ||
// // //     "/no-image.png"
// // //   }
// // //   alt={v.name || "Variant Product"}
// // //   className="h-24 w-full object-cover rounded"
// // // />

// // //                     <p className="text-sm font-medium mt-1">{v.name}</p>

// // //                     <button
// // //                       onClick={() => handleRemoveVariant(v.id)}
// // //                       className="text-red-500 text-xs mt-1"
// // //                     >
// // //                       Remove
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //           <div className="mt-8 text-center">
// // //             <button
// // //               type="submit"
// // //               disabled={formState.loading}
// // //               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// // //             >
// // //               {formState.loading ? (
// // //                 <span className="flex items-center gap-2">
// // //                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// // //                   Updating...
// // //                 </span>
// // //               ) : (
// // //                 "Update Product"
// // //               )}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EditProductPage;


// // "use client";
// // import {
// //   fetchProductsByGroup,
// //   updateProductGroup,
// //   fetchProductById,
// //   updateProductById,
// // } from "@/services/product/productService";
// // import { toast } from "react-toastify";
// // import { useParams, useRouter } from "next/navigation";
// // import React, { useEffect, useState } from "react";
// // import { getAllGstRatesAPI } from "@/components/features/gst/service/gst.api";
// // import Input from "../../../../../../components/form/input/InputField";
// // import Label from "../../../../../../components/form/Label";
// // import TextArea from "@/components/form/input/TextArea";
// // import RichTextEditor from "@/components/form/input/RichTextEditor";
// // import ChipInput from "@/components/form/input/ChipInput";
// // import { useSelector, useDispatch } from "react-redux";
// // import { RootState } from "@/redux/store";
// // import { setSelectedProduct, setProducts } from "@/redux/productSlice";
// // import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// // import { Variant } from "@/components/types/product";
// // import { apiConnector } from "@/services/apiConnector";
// // import { calculateOfferPercentage } from "@/utils/priceUtils";
// // import ReturnReplacementPolicyFields from "@/components/products/ReturnReplacementPolicyFields";
// // import {
// //   PolicyErrors,
// //   ReturnReplacementPolicy,
// //   policyFromProduct,
// //   policyToPayload,
// //   validateReturnPolicy,
// // } from "@/validations/returnPolicy";
// // import {
// //   ArrowLeft,
// //   X,
// //   Plus,
// //   Upload,
// //   Search,
// //   Package,
// //   IndianRupee,
// //   Truck,
// //   Layers,
// //   ImageIcon,
// //   FileText,
// //   ShieldCheck,
// //   Tag,
// //   FolderTree,
// //   Link2,
// //   Loader2,
// // } from "lucide-react";

// // type ProductImageType = {
// //   id: number;
// //   imageUrl: string;
// //   thumbnail?: string;
// //   medium?: string;
// //   large?: string;
// // };
// // type SubCategoryOption = { value: string; label: string; categoryId: string };
// // type ProductLite = {
// //   id: number;
// //   name: string;
// //   skuCode: string;
// //   variantGroupId?: number;
// //   images?: ProductImageType[];
// // };

// // // ---------- Utils ----------
// // const safeNum = (v: any, fallback = 0): number => {
// //   const n = Number(v);
// //   return isNaN(n) ? fallback : n;
// // };

// // const computeSellingPrice = (price: number, offer: number): number => {
// //   const priceNum = safeNum(price, 0);
// //   const offerNum = safeNum(offer, 0);
// //   return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
// // };

// // const policyFromForm = (data: any): ReturnReplacementPolicy => ({
// //   returnEligible: data?.returnEligible === true,
// //   returnWindowDays: Number(data?.returnWindowDays) || 0,
// //   replacementEligible: data?.replacementEligible === true,
// //   replacementWindowDays: Number(data?.replacementWindowDays) || 0,
// //   returnPolicyConditions: data?.returnPolicyConditions ?? "",
// // });

// // // ---------- UI primitives (design system: flat, border-gray-200, rounded-[10px]) ----------
// // const selectClass =
// //   "w-full h-11 rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700";

// // const Card = ({
// //   title,
// //   description,
// //   icon: Icon,
// //   action,
// //   children,
// // }: {
// //   title: string;
// //   description?: string;
// //   icon: React.ElementType;
// //   action?: React.ReactNode;
// //   children: React.ReactNode;
// // }) => (
// //   <section className="rounded-[10px] border border-gray-200 bg-white">
// //     <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
// //       <div className="flex items-center gap-3">
// //         <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100">
// //           <Icon className="h-[18px] w-[18px] text-gray-600" />
// //         </div>
// //         <div>
// //           <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
// //           {description && <p className="text-xs text-gray-500">{description}</p>}
// //         </div>
// //       </div>
// //       {action}
// //     </header>
// //     <div className="p-5">{children}</div>
// //   </section>
// // );

// // const Req = () => <span className="text-red-500"> *</span>;

// // const Switch = ({
// //   checked,
// //   onChange,
// //   label,
// // }: {
// //   checked: boolean;
// //   onChange: (v: boolean) => void;
// //   label: string;
// // }) => (
// //   <button
// //     type="button"
// //     role="switch"
// //     aria-checked={checked}
// //     aria-label={label}
// //     onClick={() => onChange(!checked)}
// //     className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
// //       checked ? "bg-green-600" : "bg-gray-300"
// //     }`}
// //   >
// //     <span
// //       className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
// //         checked ? "translate-x-6" : "translate-x-1"
// //       }`}
// //     />
// //   </button>
// // );

// // const ToggleRow = ({
// //   title,
// //   hint,
// //   checked,
// //   onChange,
// // }: {
// //   title: string;
// //   hint: string;
// //   checked: boolean;
// //   onChange: (v: boolean) => void;
// // }) => (
// //   <div className="flex items-center justify-between gap-4 rounded-[10px] border border-gray-200 p-4">
// //     <div>
// //       <p className="text-sm font-medium text-gray-900">{title}</p>
// //       <p className="text-xs text-gray-500">{hint}</p>
// //     </div>
// //     <Switch checked={checked} onChange={onChange} label={title} />
// //   </div>
// // );

// // const imgSrc = (img: any) =>
// //   typeof img === "string"
// //     ? img
// //     : img?.imageUrl || img?.large || img?.medium || img?.thumbnail || "/no-image.png";

// // // ---------- Page ----------
// // const EditProductPage: React.FC = () => {
// //   const dispatch = useDispatch();
// //   const [policyErrors, setPolicyErrors] = useState<PolicyErrors>({});
// //   const { id } = useParams();
// //   const router = useRouter();

// //   const { selectedProduct, products } = useSelector((state: RootState) => state.product);

// //   const [formState, setFormState] = useState({
// //     data: null as any,
// //     variants: [] as Variant[],
// //     images: [] as ProductImageType[],
// //     newImages: [] as File[],
// //     removedImageIds: [] as number[],
// //     loading: false,
// //     initialized: false,
// //   });
// //   const [options, setOptions] = useState({
// //     categories: [] as { value: string; label: string }[],
// //     subCategories: [] as SubCategoryOption[],
// //     subCategoryChildren: [] as { value: string; label: string }[],
// //     loading: true,
// //   });
// //   const [skuSearch, setSkuSearch] = useState("");
// //   const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
// //   const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
// //   const [showVariants, setShowVariants] = useState(false);
// //   const [isActive, setIsActive] = useState(true);
// //   const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);
// //   const [gstRateOptions, setGstRateOptions] = useState<any[]>([]);

// //   // Fetch product by ID
// //   useEffect(() => {
// //     const loadProduct = async () => {
// //       if (!id) return;
// //       try {
// //         const res = await fetchProductById(Number(id));
// //         dispatch(setSelectedProduct(res.product));
// //         setIsActive(res.product.isActive ?? true);
// //       } catch (error) {
// //         console.error("Failed to fetch product:", error);
// //         toast.error("Failed to load product");
// //       }
// //     };
// //     loadProduct();
// //   }, [id, dispatch]);

// //   const handleSkuSearch = async (value: string) => {
// //     setSkuSearch(value);
// //     if (value.length < 2) {
// //       setSearchResults([]);
// //       return;
// //     }
// //     try {
// //       const res = await apiConnector("GET", `/search?sku=${value}`);
// //       setSearchResults(res.data?.products || []);
// //     } catch (err) {
// //       console.error(err);
// //       setSearchResults([]);
// //     }
// //   };

// //   const handleAddVariant = (product: ProductLite) => {
// //     if (selectedVariants.some((v) => v.id === product.id)) {
// //       toast.warning("Already added");
// //       return;
// //     }
// //     setSelectedVariants((prev) => [...prev, product]);
// //     setSearchResults([]);
// //     setSkuSearch("");
// //   };

// //   const handleRemoveVariant = (pid: number) => {
// //     setSelectedVariants((prev) => prev.filter((p) => p.id !== pid));
// //   };

// //   // Fetch categories, subcategories, GST
// //   useEffect(() => {
// //     const fetchOptionsData = async () => {
// //       try {
// //         setOptions((prev) => ({ ...prev, loading: true }));

// //         const categoriesRes = await apiConnector("GET", "/category");
// //         const subCategoriesRes = await fetchSubCategoryAll();
// //         const [gstRes] = await Promise.all([getAllGstRatesAPI()]);

// //         const gstList = gstRes.data?.data || [];
// //         setGstRateOptions(gstList.filter((item: any) => item.isActive));

// //         const categories = Array.isArray(categoriesRes.data?.categories)
// //           ? categoriesRes.data.categories
// //           : [];

// //         setOptions((prev) => ({
// //           ...prev,
// //           categories: categories.map((cat: any) => ({ value: String(cat.id), label: cat.name })),
// //           subCategories: subCategoriesRes.map((cat: any) => ({
// //             value: String(cat.id),
// //             label: cat.name,
// //             categoryId: String(cat.category?.id || ""),
// //           })),
// //           loading: false,
// //         }));
// //       } catch (err) {
// //         console.error("Options fetch error", err);
// //         toast.error("Failed to load categories and subcategories");
// //         setOptions((prev) => ({ ...prev, loading: false }));
// //       }
// //     };
// //     fetchOptionsData();
// //   }, []);

// //   // Load grouped (linked) products
// //   useEffect(() => {
// //     const loadGroupProducts = async () => {
// //       if (!selectedProduct?.variantGroupId) {
// //         setSelectedVariants([]);
// //         return;
// //       }
// //       try {
// //         const list = await fetchProductsByGroup(selectedProduct.variantGroupId);
// //         setSelectedVariants(list.filter((p: any) => p.id !== selectedProduct.id));
// //       } catch (err) {
// //         console.error("Group load error", err);
// //       }
// //     };
// //     loadGroupProducts();
// //   }, [selectedProduct]);

// //   // Initialise form
// //   useEffect(() => {
// //     if (!selectedProduct) return;
// //     if (formState.initialized) return;

// //     try {
// //       const initialVariants: Variant[] = (selectedProduct.variants || []).map((v: any) => {
// //         const price = safeNum(v.price, 0);
// //         const offer = safeNum(v.offer, 0);
// //         const sellingPrice = safeNum(v.sellingPrice, computeSellingPrice(price, offer));
// //         return {
// //           id: v.id,
// //           sku: v.sku ?? "",
// //           price,
// //           sellingPrice,
// //           stock: safeNum(v.stock, 0),
// //           offer,
// //           attributes:
// //             (v.attributes || []).length > 0
// //               ? v.attributes.map((a: any) => ({ key: a.key ?? "", value: a.value ?? "" }))
// //               : [{ key: "", value: "" }],
// //         };
// //       });

// //       let filtered: any[] = [];
// //       const categoryId = selectedProduct.category?.id;
// //       if (categoryId) {
// //         filtered = options.subCategories.filter((sc: any) => sc.categoryId === String(categoryId));
// //       }
// //       setFilteredSubCategory(filtered);

// //       if (selectedProduct.subCategory?.id) {
// //         fetchChildren(String(selectedProduct.subCategory.id));
// //       }

// //       setFormState({
// //         data: {
// //           ...selectedProduct,
// //           gstRateId: String(selectedProduct.gstRate?.id || ""),
// //           dimensionUnit: selectedProduct.dimensionUnit ?? "cm",
// //           description: selectedProduct.description ?? "",
// //           categoryId: selectedProduct.category ? String(selectedProduct.category.id) : "",
// //           subCategoryId: selectedProduct.subCategory ? String(selectedProduct.subCategory.id) : "",
// //           childSubCategoryId: selectedProduct.childSubCategory?.id
// //             ? String(selectedProduct.childSubCategory.id)
// //             : "",
// //           originalPrice: safeNum(selectedProduct.originalPrice, 0),
// //           finalPrice: safeNum(selectedProduct.price, 0),
// //           // Return & Replacement: saved values only (no assumed defaults)
// //           ...policyFromProduct(selectedProduct),
// //           cancelable: selectedProduct.cancelable ?? true,
// //           warrantyInfo: selectedProduct.warrantyInfo ?? "",
// //         },
// //         variants: initialVariants,
// //         images: selectedProduct.images || [],
// //         newImages: [],
// //         removedImageIds: [],
// //         loading: false,
// //         initialized: true,
// //       });
// //     } catch (error) {
// //       console.error("Error initializing form data:", error);
// //     }
// //   }, [selectedProduct, formState.initialized]);

// //   useEffect(() => {
// //     if (formState.data?.categoryId && options.subCategories.length > 0) {
// //       setFilteredSubCategory(
// //         options.subCategories.filter((sc) => sc.categoryId === String(formState.data.categoryId))
// //       );
// //     }
// //   }, [formState.data?.categoryId, options.subCategories]);

// //   const fetchChildren = async (parentId: string) => {
// //     try {
// //       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
// //       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
// //       setOptions((prev) => ({
// //         ...prev,
// //         subCategoryChildren: children.map((item: any) => ({
// //           value: String(item.id),
// //           label: item.name,
// //           parentId: String(parentId),
// //         })),
// //       }));
// //     } catch (error) {
// //       console.error("Failed to fetch subcategory children:", error);
// //       setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
// //     }
// //   };

// //   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const value = e.target.value;
// //     setFilteredSubCategory(options.subCategories.filter((sc) => sc.categoryId === value));
// //     setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
// //     setFormState((prev) => ({
// //       ...prev,
// //       data: { ...prev.data, categoryId: value, subCategoryId: "", childSubCategoryId: "" },
// //     }));
// //   };

// //   const handleSubCategoryChange = (value: string) => {
// //     setFormState((prev) => ({
// //       ...prev,
// //       data: { ...prev.data, subCategoryId: value, childSubCategoryId: "" },
// //     }));
// //     if (value) fetchChildren(value);
// //     else setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
// //   };

// //   // Generic change handler (form fields + variant fields)
// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
// //     opts?: { variantIndex?: number; attrIndex?: number; attrField?: "key" | "value" }
// //   ) => {
// //     const { name, value, type } = e.target;
// //     const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

// //     if (opts?.variantIndex !== undefined) {
// //       const { variantIndex, attrIndex, attrField } = opts;

// //       setFormState((prev) => {
// //         const updatedVariants = [...prev.variants];

// //         if (attrIndex !== undefined && attrField && updatedVariants[variantIndex]?.attributes[attrIndex]) {
// //           updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
// //         } else if (name !== "attributes") {
// //           (updatedVariants[variantIndex] as any)[name] = value;

// //           if (name === "price" || name === "sellingPrice") {
// //             const price = name === "price" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].price, 0);
// //             let sellingPrice =
// //               name === "sellingPrice" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].sellingPrice, 0);

// //             if (sellingPrice < 0) sellingPrice = 0;
// //             if (sellingPrice > price) sellingPrice = price;

// //             updatedVariants[variantIndex].sellingPrice = sellingPrice;
// //             updatedVariants[variantIndex].offer =
// //               price > 0 ? Math.round(((price - sellingPrice) / price) * 100) : 0;
// //           }
// //         }
// //         return { ...prev, variants: updatedVariants };
// //       });
// //       return;
// //     }

// //     setFormState((prev) => ({
// //       ...prev,
// //       data: { ...prev.data, [name]: type === "checkbox" ? checked : value },
// //     }));
// //   };

// //   const setField = (name: string, value: any) =>
// //     setFormState((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));

// //   // Variants
// //   const addVariant = () => {
// //     setFormState((prev) => ({
// //       ...prev,
// //       variants: [
// //         ...prev.variants,
// //         { sku: "", price: 0, sellingPrice: 0, stock: 0, offer: 0, attributes: [{ key: "", value: "" }] },
// //       ],
// //     }));
// //   };

// //   const toggleVariants = () => {
// //     setShowVariants((prev) => !prev);
// //     if (!showVariants && formState.variants.length === 0) addVariant();
// //   };

// //   const removeVariant = (index: number) => {
// //     setFormState((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
// //   };

// //   const addAttribute = (vIndex: number) => {
// //     setFormState((prev) => {
// //       const updatedVariants = [...prev.variants];
// //       updatedVariants[vIndex].attributes.push({ key: "", value: "" });
// //       return { ...prev, variants: updatedVariants };
// //     });
// //   };

// //   const removeAttribute = (variantIndex: number, attrIndex: number) => {
// //     setFormState((prev) => {
// //       const updatedVariants = [...prev.variants];
// //       updatedVariants[variantIndex].attributes = updatedVariants[variantIndex].attributes.filter(
// //         (_, i) => i !== attrIndex
// //       );
// //       return { ...prev, variants: updatedVariants };
// //     });
// //   };

// //   // Images
// //   const handleRemoveImage = (index: number) => {
// //     setFormState((prev) => {
// //       const imageToRemove = prev.images[index];
// //       if (!imageToRemove) return prev;
// //       return {
// //         ...prev,
// //         removedImageIds: imageToRemove.id ? [...prev.removedImageIds, imageToRemove.id] : prev.removedImageIds,
// //         images: prev.images.filter((_, i) => i !== index),
// //       };
// //     });
// //   };

// //   const handleRemoveNewImage = (index: number) => {
// //     setFormState((prev) => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
// //   };

// //   const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (!e.target.files) return;
// //     const filesArray = Array.from(e.target.files);
// //     const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

// //     if (totalImages > 10) {
// //       toast.error("Maximum 10 images allowed");
// //       return;
// //     }

// //     const validFiles = filesArray.filter((file) => {
// //       if (!file.type.startsWith("image/")) {
// //         toast.error(`File ${file.name} is not an image`);
// //         return false;
// //       }
// //       if (file.size > 5 * 1024 * 1024) {
// //         toast.error(`Image ${file.name} is too large (max 5MB)`);
// //         return false;
// //       }
// //       return true;
// //     });

// //     setFormState((prev) => ({ ...prev, newImages: [...prev.newImages, ...validFiles] }));
// //     e.target.value = "";
// //   };

// //   // Submit
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!formState.data) {
// //       toast.error("Form data not initialized");
// //       return;
// //     }
// //     if (!formState.data.name?.trim()) {
// //       toast.error("Product name is required");
// //       return;
// //     }
// //     if (!formState.data.categoryId) {
// //       toast.error("Category is required");
// //       return;
// //     }
// //     if (!showVariants && formState.data.originalPrice <= 0) {
// //       toast.error("Original price must be greater than 0");
// //       return;
// //     }
// //     if (showVariants) {
// //       const invalidVariant = formState.variants.find((v) => !v.sku?.trim() || v.price <= 0 || v.stock < 0);
// //       if (invalidVariant) {
// //         toast.error("All variants must have SKU, valid price, and stock");
// //         return;
// //       }
// //     }
// //     const policy = policyFromForm(formState.data);
// //     const policyIssues = validateReturnPolicy(policy);
// //     setPolicyErrors(policyIssues);
// //     if (Object.keys(policyIssues).length > 0) {
// //       toast.error(Object.values(policyIssues)[0] as string);
// //       return;
// //     }

// //     setFormState((prev) => ({ ...prev, loading: true }));
// //     try {
// //       const sanitizedVariants = formState.variants
// //         .filter((v) => v.sku || v.price || v.stock)
// //         .map((v) => ({
// //           id: v.id,
// //           sku: v.sku?.trim() ?? "",
// //           price: safeNum(v.price, 0),
// //           sellingPrice: safeNum(
// //             v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
// //             computeSellingPrice(v.price, v.offer ?? 0)
// //           ),
// //           offer: safeNum(v.offer ?? 0, 0),
// //           stock: safeNum(v.stock, 0),
// //           attributes: (v.attributes || [])
// //             .filter((a) => a.key?.trim() && a.value?.trim())
// //             .map((a) => ({ key: a.key?.trim() ?? "", value: a.value?.trim() ?? "" })),
// //         }));

// //       const hasVariants = showVariants && sanitizedVariants.length > 0;
// //       const productData = new FormData();

// //       productData.append("name", formState.data.name?.trim() || "");
// //       productData.append("description", formState.data.description?.trim() || "");
// //       productData.append("slug", formState.data.slug?.trim() || "");
// //       productData.append("categoryId", String(formState.data.categoryId ?? 0));
// //       if (formState.data.subCategoryId) productData.append("subCategoryId", formState.data.subCategoryId);
// //       productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
// //       productData.append("originalPrice", String(formState.data.originalPrice || 0));
// //       productData.append("finalPrice", String(formState.data.finalPrice || 0));
// //       productData.append("hsnCode", String(formState.data.hsnCode));
// //       productData.append("gstRateId", String(formState.data.gstRateId));
// //       productData.append("price", String(hasVariants ? 0 : formState.data.finalPrice || 0));
// //       productData.append("material", formState.data.material?.trim() || "");
// //       productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
// //       productData.append("length", String(formState.data.length ?? 0));
// //       productData.append("height", String(formState.data.height ?? 0));
// //       productData.append("width", String(formState.data.width ?? 0));
// //       productData.append("weight", String(formState.data.weight ?? 0));
// //       productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
// //       productData.append("dimensionUnit", formState.data.dimensionUnit || "cm");
// //       productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
// //       productData.append("skuCode", formState.data.skuCode?.trim() || "");

// //       Object.entries(policyToPayload(policy)).forEach(([key, value]) => productData.append(key, value));

// //       productData.append("cancelable", String(formState.data.cancelable ?? true));
// //       productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
// //       productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
// //       productData.append("hasVariants", String(hasVariants));
// //       productData.append("isActive", String(isActive));
// //       productData.append("keywords", JSON.stringify(formState.data.keywords || []));

// //       if (hasVariants) productData.append("variants", JSON.stringify(sanitizedVariants));

// //       if (formState.removedImageIds.length > 0) {
// //         productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
// //       }
// //       formState.newImages.forEach((file) => productData.append("images", file));

// //       const updatedProduct = await updateProductById(formState.data.id, productData);

// //       if (selectedVariants.length > 0) {
// //         await updateProductGroup(formState.data.id, selectedVariants.map((v) => v.id));
// //       }

// //       const updatedList = products.map((p) => (p.id === formState.data.id ? updatedProduct : p));
// //       dispatch(setProducts(updatedList));
// //       dispatch(setSelectedProduct(updatedProduct));

// //       toast.success("Product updated successfully");
// //       router.push("/product");
// //       setFormState((prev) => ({ ...prev, newImages: [], removedImageIds: [], loading: false }));
// //     } catch (err: any) {
// //       console.error("Update error:", err);
// //       toast.error(err.message || "Update failed");
// //       setFormState((prev) => ({ ...prev, loading: false }));
// //     }
// //   };

// //   // Loading state
// //   if (!formState.data || options.loading) {
// //     return (
// //       <div className="flex min-h-[60vh] items-center justify-center">
// //         <div className="flex items-center gap-3 text-gray-600">
// //           <Loader2 className="h-5 w-5 animate-spin" />
// //           <span className="text-sm font-medium">Loading product…</span>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const d = formState.data;
// //   const totalImages = formState.images.length + formState.newImages.length;

// //   return (
// //     <form onSubmit={handleSubmit} className="mx-auto w-full lg:w-11/12">
// //       {/* Sticky action bar */}
// //       <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
// //         <div className="flex min-w-0 items-center gap-3">
// //           <button
// //             type="button"
// //             onClick={() => router.back()}
// //             className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-gray-200 text-gray-600 hover:bg-gray-100"
// //             aria-label="Go back"
// //           >
// //             <ArrowLeft className="h-4 w-4" />
// //           </button>
// //           <div className="min-w-0">
// //             <h1 className="truncate text-lg font-semibold text-gray-900">{d.name || "Edit product"}</h1>
// //             <p className="text-xs text-gray-500">Edit product · SKU {d.skuCode || "—"}</p>
// //           </div>
// //           <span
// //             className={`ml-1 hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-block ${
// //               isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
// //             }`}
// //           >
// //             {isActive ? "Active" : "Inactive"}
// //           </span>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <button
// //             type="button"
// //             onClick={() => router.back()}
// //             className="h-10 rounded-[10px] border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
// //           >
// //             Discard
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={formState.loading}
// //             className="flex h-10 items-center gap-2 rounded-[10px] bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
// //           >
// //             {formState.loading && <Loader2 className="h-4 w-4 animate-spin" />}
// //             {formState.loading ? "Saving…" : "Save changes"}
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-3">
// //         {/* ============ MAIN COLUMN ============ */}
// //         <div className="space-y-6 lg:col-span-2">
// //           {/* Basic info */}
// //           <Card title="Basic information" description="Name, SKU and description customers will see" icon={FileText}>
// //             <div className="space-y-4">
// //               <div>
// //                 <Label>
// //                   Product name
// //                   <Req />
// //                 </Label>
// //                 <Input type="text" name="name" placeholder="e.g. Cotton bath towel" value={d.name || ""} onChange={handleChange} />
// //               </div>
// //               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //                 <div>
// //                   <Label>
// //                     SKU code
// //                     <Req />
// //                   </Label>
// //                   <Input type="text" name="skuCode" placeholder="Enter SKU code" value={d.skuCode || ""} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>
// //                     Material
// //                     <Req />
// //                   </Label>
// //                   <Input type="text" name="material" placeholder="e.g. Cotton" value={d.material || ""} onChange={handleChange} />
// //                 </div>
// //               </div>
// //               <div>
// //                 <Label>Description</Label>
// //                 <RichTextEditor value={d.description || ""} onChange={(value) => setField("description", value)} />
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Media */}
// //           <Card
// //             title="Media"
// //             description={`${totalImages}/10 images · first image is the main photo · max 5MB each`}
// //             icon={ImageIcon}
// //           >
// //             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
// //               {formState.images.map((img, index) => (
// //                 <div
// //                   key={`existing-${index}`}
// //                   className="group relative aspect-square overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50"
// //                 >
// //                   <img src={imgSrc(img)} alt={`product-${index}`} className="h-full w-full object-cover" />
// //                   {index === 0 && (
// //                     <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
// //                       Main
// //                     </span>
// //                   )}
// //                   <button
// //                     type="button"
// //                     onClick={() => handleRemoveImage(index)}
// //                     className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
// //                     aria-label="Remove image"
// //                   >
// //                     <X className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //               ))}

// //               {formState.newImages.map((file, index) => (
// //                 <div
// //                   key={`new-${index}`}
// //                   className="group relative aspect-square overflow-hidden rounded-[10px] border-2 border-green-300"
// //                 >
// //                   <img src={URL.createObjectURL(file)} alt={`new-${index}`} className="h-full w-full object-cover" />
// //                   <span className="absolute left-2 top-2 rounded-md bg-green-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
// //                     New
// //                   </span>
// //                   <button
// //                     type="button"
// //                     onClick={() => handleRemoveNewImage(index)}
// //                     className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
// //                     aria-label="Remove image"
// //                   >
// //                     <X className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //               ))}

// //               {totalImages < 10 && (
// //                 <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600">
// //                   <Upload className="h-6 w-6" />
// //                   <span className="text-xs font-medium">Add images</span>
// //                   <input type="file" accept="image/*" onChange={handleAddImages} className="hidden" multiple />
// //                 </label>
// //               )}
// //             </div>
// //           </Card>

// //           {/* Pricing & tax */}
// //           <Card
// //             title="Pricing & tax"
// //             description={showVariants ? "Price is set on each variant below" : "Set price, discount and GST"}
// //             icon={IndianRupee}
// //           >
// //             <div className="space-y-4">
// //               {!showVariants && (
// //                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
// //                   <div>
// //                     <Label>
// //                       Original price (₹)
// //                       <Req />
// //                     </Label>
// //                     <Input name="originalPrice" type="number" min="0" placeholder="0" value={d.originalPrice || 0} onChange={handleChange} />
// //                   </div>
// //                   <div>
// //                     <Label>
// //                       Selling price (₹)
// //                       <Req />
// //                     </Label>
// //                     <Input name="finalPrice" type="number" min="0" placeholder="0" value={d.finalPrice || ""} onChange={handleChange} />
// //                   </div>
// //                   <div>
// //                     <Label>Discount %</Label>
// //                     <Input
// //                       type="number"
// //                       value={calculateOfferPercentage(Number(d.originalPrice), Number(d.finalPrice))}
// //                       {...({ readOnly: true } as any)}
// //                       className="cursor-not-allowed bg-gray-100"
// //                     />
// //                   </div>
// //                 </div>
// //               )}

// //               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //                 <div>
// //                   <Label>
// //                     HSN code
// //                     <Req />
// //                   </Label>
// //                   <Input name="hsnCode" placeholder="HSN code" type="number" min="0" value={d.hsnCode || 0} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>
// //                     GST rate
// //                     <Req />
// //                   </Label>
// //                   <select name="gstRateId" value={d.gstRateId || ""} onChange={handleChange} className={selectClass} required>
// //                     <option value="">Select GST rate</option>
// //                     {gstRateOptions.map((gst) => (
// //                       <option key={gst.id} value={gst.id}>
// //                         {gst.totalRate}%
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Inventory */}
// //           {!showVariants && (
// //             <Card title="Inventory" description="Stock and pack size" icon={Package}>
// //               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// //                 <div>
// //                   <Label>
// //                     Stock quantity
// //                     <Req />
// //                   </Label>
// //                   <Input type="number" name="stock" placeholder="0" value={d.stock || 0} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Pack quantity (optional)</Label>
// //                   <Input type="number" min="1" name="packQuantity" placeholder="e.g. 10" value={d.packQuantity || 0} onChange={handleChange} />
// //                   <p className="mt-1 text-xs text-gray-500">Number of items included in one pack</p>
// //                 </div>
// //               </div>
// //             </Card>
// //           )}

// //           {/* Variants */}
// //           <Card
// //             title="Variants"
// //             description="Different sizes, colours or other options with their own price and stock"
// //             icon={Layers}
// //             action={
// //               <button
// //                 type="button"
// //                 onClick={toggleVariants}
// //                 className={`flex h-9 items-center gap-1.5 rounded-[10px] border px-3 text-sm font-medium ${
// //                   showVariants
// //                     ? "border-red-200 text-red-600 hover:bg-red-50"
// //                     : "border-gray-200 text-blue-600 hover:bg-gray-100"
// //                 }`}
// //               >
// //                 {showVariants ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
// //                 {showVariants ? "Remove variants" : "Add variants"}
// //               </button>
// //             }
// //           >
// //             {!showVariants ? (
// //               <p className="text-sm text-gray-500">This product has no variants. Price and stock are managed above.</p>
// //             ) : (
// //               <div className="space-y-4">
// //                 {formState.variants.map((variant, vIndex) => (
// //                   <div key={vIndex} className="rounded-[10px] border border-gray-200 bg-gray-50/50 p-4">
// //                     <div className="mb-4 flex items-center justify-between">
// //                       <p className="text-sm font-semibold text-gray-800">Variant {vIndex + 1}</p>
// //                       {formState.variants.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeVariant(vIndex)}
// //                           className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
// //                         >
// //                           <X className="h-4 w-4" /> Remove
// //                         </button>
// //                       )}
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
// //                       <div className="col-span-2 md:col-span-2">
// //                         <Label>
// //                           SKU
// //                           <Req />
// //                         </Label>
// //                         <Input name="sku" value={variant.sku} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
// //                       </div>
// //                       <div className="col-span-2 md:col-span-2">
// //                         <Label>
// //                           Stock
// //                           <Req />
// //                         </Label>
// //                         <Input name="stock" type="number" value={variant.stock} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
// //                       </div>
// //                       <div>
// //                         <Label>
// //                           Price (₹)
// //                           <Req />
// //                         </Label>
// //                         <Input name="price" type="number" value={variant.price} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
// //                       </div>
// //                       <div>
// //                         <Label>Selling price (₹)</Label>
// //                         <Input
// //                           name="sellingPrice"
// //                           type="number"
// //                           value={variant.sellingPrice || 0}
// //                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
// //                         />
// //                       </div>
// //                       <div>
// //                         <Label>Discount %</Label>
// //                         <Input
// //                           type="number"
// //                           value={
// //                             variant.price && variant.sellingPrice
// //                               ? Math.round(((variant.price - variant.sellingPrice) / variant.price) * 100)
// //                               : 0
// //                           }
// //                           {...({ readOnly: true } as any)}
// //                           className="cursor-not-allowed bg-gray-100"
// //                         />
// //                       </div>
// //                     </div>

// //                     <div className="mt-5 border-t border-gray-200 pt-4">
// //                       <p className="mb-3 text-sm font-medium text-gray-700">Attributes</p>
// //                       <div className="space-y-3">
// //                         {variant.attributes.map((attr, aIndex) => (
// //                           <div key={aIndex} className="flex items-end gap-3">
// //                             <div className="flex-1">
// //                               <Label>Name</Label>
// //                               <Input
// //                                 value={attr.key}
// //                                 placeholder="e.g. Colour"
// //                                 onChange={(e) =>
// //                                   handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "key" })
// //                                 }
// //                               />
// //                             </div>
// //                             <div className="flex-1">
// //                               <Label>Value</Label>
// //                               <Input
// //                                 value={attr.value}
// //                                 placeholder="e.g. Red"
// //                                 onChange={(e) =>
// //                                   handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "value" })
// //                                 }
// //                               />
// //                             </div>
// //                             {variant.attributes.length > 1 && (
// //                               <button
// //                                 type="button"
// //                                 onClick={() => removeAttribute(vIndex, aIndex)}
// //                                 className="mb-1 flex h-9 w-9 items-center justify-center rounded-[10px] text-gray-500 hover:bg-gray-100 hover:text-red-600"
// //                                 aria-label="Remove attribute"
// //                               >
// //                                 <X className="h-4 w-4" />
// //                               </button>
// //                             )}
// //                           </div>
// //                         ))}
// //                       </div>
// //                       <button
// //                         type="button"
// //                         onClick={() => addAttribute(vIndex)}
// //                         className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
// //                       >
// //                         <Plus className="h-4 w-4" /> Add attribute
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}

// //                 <button
// //                   type="button"
// //                   onClick={addVariant}
// //                   className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-600 hover:text-blue-600"
// //                 >
// //                   <Plus className="h-4 w-4" /> Add another variant
// //                 </button>
// //               </div>
// //             )}
// //           </Card>

// //           {/* Shipping */}
// //           <Card title="Shipping" description="Package size, weight and delivery options" icon={Truck}>
// //             <div className="space-y-5">
// //               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
// //                 <div>
// //                   <Label>
// //                     Length (cm)
// //                     <Req />
// //                   </Label>
// //                   <Input type="text" name="length" placeholder="0" value={d.length || ""} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>
// //                     Width (cm)
// //                     <Req />
// //                   </Label>
// //                   <Input type="text" name="width" placeholder="0" value={d.width || ""} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>
// //                     Height (cm)
// //                     <Req />
// //                   </Label>
// //                   <Input type="text" name="height" placeholder="0" value={d.height || ""} onChange={handleChange} />
// //                 </div>
// //               </div>

// //               <div className="max-w-xs">
// //                 <Label>
// //                   Weight
// //                   <Req />
// //                 </Label>
// //                 <div className="flex items-center gap-2">
// //                   <Input
// //                     type="number"
// //                     name="weight"
// //                     placeholder="0"
// //                     value={d.weight || ""}
// //                     onChange={handleChange}
// //                     className="w-full"
// //                     min="0"
// //                   />
// //                   <select name="weightUnit" value={d.weightUnit || "kg"} onChange={handleChange} className={`${selectClass} !w-20`}>
// //                     <option value="kg">kg</option>
// //                     <option value="g">g</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
// //                 <ToggleRow
// //                   title="Shipping available"
// //                   hint="Allow this product to be delivered"
// //                   checked={d.shippingAvailable ?? false}
// //                   onChange={(v) => setField("shippingAvailable", v)}
// //                 />
// //                 <ToggleRow
// //                   title="Cash on delivery"
// //                   hint="Let customers pay on delivery"
// //                   checked={d.codAvailable ?? false}
// //                   onChange={(v) => setField("codAvailable", v)}
// //                 />
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Policies */}
// //           <Card title="Policies" description="Returns, replacement, cancellation and warranty" icon={ShieldCheck}>
// //             <div className="space-y-5">
// //               <ReturnReplacementPolicyFields
// //                 value={policyFromForm(d)}
// //                 errors={policyErrors}
// //                 onChange={(patch) => {
// //                   setFormState((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
// //                   setPolicyErrors((prev) => {
// //                     const next = { ...prev };
// //                     (Object.keys(patch) as (keyof ReturnReplacementPolicy)[]).forEach((k) => delete next[k]);
// //                     return next;
// //                   });
// //                 }}
// //               />

// //               <ToggleRow
// //                 title="Customer can cancel before dispatch"
// //                 hint="When off, customers can't cancel orders with this product. Staff can still cancel with a reason."
// //                 checked={d.cancelable !== false}
// //                 onChange={(v) => setField("cancelable", v)}
// //               />

// //               <div>
// //                 <Label>Warranty info</Label>
// //                 <TextArea
// //                   name="warrantyInfo"
// //                   placeholder="e.g. 1-year manufacturer warranty"
// //                   value={d.warrantyInfo || ""}
// //                   onChange={handleChange}
// //                   rows={3}
// //                 />
// //               </div>
// //             </div>
// //           </Card>
// //         </div>

// //         {/* ============ SIDEBAR ============ */}
// //         <aside className="space-y-6 lg:col-span-1">
// //           {/* Status */}
// //           <section className="rounded-[10px] border border-gray-200 bg-white p-5">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <h2 className="text-[15px] font-semibold text-gray-900">Status</h2>
// //                 <p className="mt-0.5 text-xs text-gray-500">
// //                   {isActive ? "Visible on the storefront" : "Hidden from the storefront"}
// //                 </p>
// //               </div>
// //               <Switch checked={isActive} onChange={setIsActive} label="Toggle product status" />
// //             </div>
// //           </section>

// //           {/* Organisation */}
// //           <Card title="Organisation" description="Where this product is listed" icon={FolderTree}>
// //             <div className="space-y-4">
// //               <div>
// //                 <Label>
// //                   Category
// //                   <Req />
// //                 </Label>
// //                 <select
// //                   name="categoryId"
// //                   value={d.categoryId || ""}
// //                   onChange={handleCategoryChange}
// //                   className={selectClass}
// //                   required
// //                 >
// //                   <option value="">Select category</option>
// //                   {options.categories.map((cat) => (
// //                     <option key={cat.value} value={cat.value}>
// //                       {cat.label}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {filteredSubCategory.length > 0 && (
// //                 <div>
// //                   <Label>Subcategory</Label>
// //                   <select
// //                     name="subCategoryId"
// //                     value={d.subCategoryId || ""}
// //                     onChange={(e) => handleSubCategoryChange(e.target.value)}
// //                     className={selectClass}
// //                   >
// //                     <option value="">Select subcategory</option>
// //                     {filteredSubCategory.map((sub) => (
// //                       <option key={sub.value} value={sub.value}>
// //                         {sub.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               )}

// //               {options.subCategoryChildren.length > 0 && (
// //                 <div>
// //                   <Label>Child category</Label>
// //                   <select
// //                     name="childSubCategoryId"
// //                     value={d.childSubCategoryId || ""}
// //                     onChange={handleChange}
// //                     className={selectClass}
// //                   >
// //                     <option value="">Select child category</option>
// //                     {options.subCategoryChildren.map((child) => (
// //                       <option key={child.value} value={child.value}>
// //                         {child.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               )}
// //             </div>
// //           </Card>

// //           {/* Keywords */}
// //           <Card title="Search keywords" description="Help customers find this product" icon={Tag}>
// //             <ChipInput
// //               value={d.keywords || []}
// //               onChange={(keywords) => setFormState((prev) => ({ ...prev, data: { ...prev.data, keywords } }))}
// //               placeholder="Type a keyword and press Enter"
// //             />
// //           </Card>

// //           {/* Linked products */}
// //           <Card
// //             title="Linked products"
// //             description="Show other products as options (e.g. other colours)"
// //             icon={Link2}
// //           >
// //             <div className="relative">
// //               <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
// //               <Input
// //                 placeholder="Search by SKU…"
// //                 value={skuSearch}
// //                 onChange={(e) => handleSkuSearch(e.target.value)}
// //                 className="!pl-9"
// //               />
// //               {searchResults.length > 0 && (
// //                 <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-[10px] border border-gray-200 bg-white">
// //                   {searchResults.map((p) => (
// //                     <button
// //                       type="button"
// //                       key={p.id}
// //                       onClick={() => handleAddVariant(p)}
// //                       className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-100"
// //                     >
// //                       <img
// //                         src={p.images?.[0]?.imageUrl || "/no-image.png"}
// //                         alt={p.name || "Product"}
// //                         className="h-10 w-10 rounded-md object-cover"
// //                       />
// //                       <div className="min-w-0 flex-1">
// //                         <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
// //                         <p className="text-xs text-gray-500">{p.skuCode}</p>
// //                       </div>
// //                       <Plus className="h-4 w-4 text-blue-600" />
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {selectedVariants.length > 0 ? (
// //               <ul className="mt-4 space-y-2">
// //                 {selectedVariants.map((v) => (
// //                   <li key={v.id} className="flex items-center gap-3 rounded-[10px] border border-gray-200 p-2">
// //                     <img
// //                       src={
// //                         v.images?.[0]?.large ||
// //                         v.images?.[0]?.medium ||
// //                         v.images?.[0]?.thumbnail ||
// //                         v.images?.[0]?.imageUrl ||
// //                         "/no-image.png"
// //                       }
// //                       alt={v.name || "Linked product"}
// //                       className="h-12 w-12 rounded-md object-cover"
// //                     />
// //                     <div className="min-w-0 flex-1">
// //                       <p className="truncate text-sm font-medium text-gray-900">{v.name}</p>
// //                       <p className="text-xs text-gray-500">{v.skuCode}</p>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       onClick={() => handleRemoveVariant(v.id)}
// //                       className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 hover:bg-gray-100 hover:text-red-600"
// //                       aria-label="Remove linked product"
// //                     >
// //                       <X className="h-4 w-4" />
// //                     </button>
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p className="mt-4 text-xs text-gray-500">No linked products yet.</p>
// //             )}
// //           </Card>
// //         </aside>
// //       </div>
// //     </form>
// //   );
// // };

// // export default EditProductPage;



// "use client";
// import {
//   fetchProductsByGroup,
//   updateProductGroup,
//   fetchProductById,
//   updateProductById,
// } from "@/services/product/productService";
// import { toast } from "react-toastify";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { getAllGstRatesAPI } from "@/components/features/gst/service/gst.api";
// import Input from "../../../../../../components/form/input/InputField";
// import Label from "../../../../../../components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import RichTextEditor from "@/components/form/input/RichTextEditor";
// import ChipInput from "@/components/form/input/ChipInput";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setSelectedProduct, setProducts } from "@/redux/productSlice";
// import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// import { Variant } from "@/components/types/product";
// import { apiConnector } from "@/services/apiConnector";
// import { calculateOfferPercentage } from "@/utils/priceUtils";
// import ReturnReplacementPolicyFields from "@/components/products/ReturnReplacementPolicyFields";
// import {
//   PolicyErrors,
//   ReturnReplacementPolicy,
//   policyFromProduct,
//   policyToPayload,
//   validateReturnPolicy,
// } from "@/validations/returnPolicy";
// import {
//   ArrowLeft,
//   X,
//   Plus,
//   Upload,
//   Search,
//   Package,
//   IndianRupee,
//   Truck,
//   Layers,
//   ImageIcon,
//   FileText,
//   ShieldCheck,
//   Tag,
//   FolderTree,
//   Link2,
//   Loader2,
// } from "lucide-react";

// type ProductImageType = {
//   id: number;
//   imageUrl: string;
//   thumbnail?: string;
//   medium?: string;
//   large?: string;
// };
// type SubCategoryOption = { value: string; label: string; categoryId: string };
// type ProductLite = {
//   id: number;
//   name: string;
//   skuCode: string;
//   variantGroupId?: number;
//   images?: ProductImageType[];
// };

// // ---------- Utils ----------
// const safeNum = (v: any, fallback = 0): number => {
//   const n = Number(v);
//   return isNaN(n) ? fallback : n;
// };

// const computeSellingPrice = (price: number, offer: number): number => {
//   const priceNum = safeNum(price, 0);
//   const offerNum = safeNum(offer, 0);
//   return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
// };

// const policyFromForm = (data: any): ReturnReplacementPolicy => ({
//   returnEligible: data?.returnEligible === true,
//   returnWindowDays: Number(data?.returnWindowDays) || 0,
//   replacementEligible: data?.replacementEligible === true,
//   replacementWindowDays: Number(data?.replacementWindowDays) || 0,
//   returnPolicyConditions: data?.returnPolicyConditions ?? "",
// });

// // ---------- UI primitives ----------
// const selectClass =
//   "w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700";

// const Card = ({
//   title,
//   description,
//   icon: Icon,
//   action,
//   children,
// }: {
//   title: string;
//   description?: string;
//   icon: React.ElementType;
//   action?: React.ReactNode;
//   children: React.ReactNode;
// }) => (
//   <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//     <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-slate-50/50 px-5 py-4">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
//           <Icon className="h-5 w-5" />
//         </div>
//         <div>
//           <h2 className="text-base font-semibold text-gray-900">{title}</h2>
//           {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
//         </div>
//       </div>
//       {action}
//     </header>
//     <div className="p-5">{children}</div>
//   </section>
// );

// const Req = () => <span className="text-red-500"> *</span>;

// const Switch = ({
//   checked,
//   onChange,
//   label,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
// }) => (
//   <button
//     type="button"
//     role="switch"
//     aria-checked={checked}
//     aria-label={label}
//     onClick={() => onChange(!checked)}
//     className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//       checked ? "bg-green-500" : "bg-gray-300"
//     }`}
//   >
//     <span
//       className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// const ToggleRow = ({
//   title,
//   hint,
//   checked,
//   onChange,
// }: {
//   title: string;
//   hint: string;
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) => (
//   <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
//     <div>
//       <p className="text-sm font-medium text-gray-900">{title}</p>
//       <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
//     </div>
//     <Switch checked={checked} onChange={onChange} label={title} />
//   </div>
// );

// const imgSrc = (img: any) =>
//   typeof img === "string"
//     ? img
//     : img?.imageUrl || img?.large || img?.medium || img?.thumbnail || "/no-image.png";

// // ---------- Page ----------
// const EditProductPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const [policyErrors, setPolicyErrors] = useState<PolicyErrors>({});
//   const { id } = useParams();
//   const router = useRouter();

//   const { selectedProduct, products } = useSelector((state: RootState) => state.product);

//   const [formState, setFormState] = useState({
//     data: null as any,
//     variants: [] as Variant[],
//     images: [] as ProductImageType[],
//     newImages: [] as File[],
//     removedImageIds: [] as number[],
//     loading: false,
//     initialized: false,
//   });
//   const [options, setOptions] = useState({
//     categories: [] as { value: string; label: string }[],
//     subCategories: [] as SubCategoryOption[],
//     subCategoryChildren: [] as { value: string; label: string }[],
//     loading: true,
//   });
//   const [skuSearch, setSkuSearch] = useState("");
//   const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
//   const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
//   const [showVariants, setShowVariants] = useState(false);
//   const [isActive, setIsActive] = useState(true);
//   const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);
//   const [gstRateOptions, setGstRateOptions] = useState<any[]>([]);

//   // Fetch product by ID
//   useEffect(() => {
//     const loadProduct = async () => {
//       if (!id) return;
//       try {
//         const res = await fetchProductById(Number(id));
//         dispatch(setSelectedProduct(res.product));
//         setIsActive(res.product.isActive ?? true);
//       } catch (error) {
//         console.error("Failed to fetch product:", error);
//         toast.error("Failed to load product");
//       }
//     };
//     loadProduct();
//   }, [id, dispatch]);

//   const handleSkuSearch = async (value: string) => {
//     setSkuSearch(value);
//     if (value.length < 2) {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const res = await apiConnector("GET", `/search?sku=${value}`);
//       setSearchResults(res.data?.products || []);
//     } catch (err) {
//       console.error(err);
//       setSearchResults([]);
//     }
//   };

//   const handleAddVariant = (product: ProductLite) => {
//     if (selectedVariants.some((v) => v.id === product.id)) {
//       toast.warning("Already added");
//       return;
//     }
//     setSelectedVariants((prev) => [...prev, product]);
//     setSearchResults([]);
//     setSkuSearch("");
//   };

//   const handleRemoveVariant = (pid: number) => {
//     setSelectedVariants((prev) => prev.filter((p) => p.id !== pid));
//   };

//   // Fetch categories, subcategories, GST
//   useEffect(() => {
//     const fetchOptionsData = async () => {
//       try {
//         setOptions((prev) => ({ ...prev, loading: true }));

//         const categoriesRes = await apiConnector("GET", "/category");
//         const subCategoriesRes = await fetchSubCategoryAll();
//         const [gstRes] = await Promise.all([getAllGstRatesAPI()]);

//         const gstList = gstRes.data?.data || [];
//         setGstRateOptions(gstList.filter((item: any) => item.isActive));

//         const categories = Array.isArray(categoriesRes.data?.categories)
//           ? categoriesRes.data.categories
//           : [];

//         setOptions((prev) => ({
//           ...prev,
//           categories: categories.map((cat: any) => ({ value: String(cat.id), label: cat.name })),
//           subCategories: subCategoriesRes.map((cat: any) => ({
//             value: String(cat.id),
//             label: cat.name,
//             categoryId: String(cat.category?.id || ""),
//           })),
//           loading: false,
//         }));
//       } catch (err) {
//         console.error("Options fetch error", err);
//         toast.error("Failed to load categories and subcategories");
//         setOptions((prev) => ({ ...prev, loading: false }));
//       }
//     };
//     fetchOptionsData();
//   }, []);

//   // Load grouped (linked) products
//   useEffect(() => {
//     const loadGroupProducts = async () => {
//       if (!selectedProduct?.variantGroupId) {
//         setSelectedVariants([]);
//         return;
//       }
//       try {
//         const list = await fetchProductsByGroup(selectedProduct.variantGroupId);
//         setSelectedVariants(list.filter((p: any) => p.id !== selectedProduct.id));
//       } catch (err) {
//         console.error("Group load error", err);
//       }
//     };
//     loadGroupProducts();
//   }, [selectedProduct]);

//   // Initialise form
//   useEffect(() => {
//     if (!selectedProduct) return;
//     if (formState.initialized) return;

//     try {
//       const initialVariants: Variant[] = (selectedProduct.variants || []).map((v: any) => {
//         const price = safeNum(v.price, 0);
//         const offer = safeNum(v.offer, 0);
//         const sellingPrice = safeNum(v.sellingPrice, computeSellingPrice(price, offer));
//         return {
//           id: v.id,
//           sku: v.sku ?? "",
//           price,
//           sellingPrice,
//           stock: safeNum(v.stock, 0),
//           offer,
//           attributes:
//             (v.attributes || []).length > 0
//               ? v.attributes.map((a: any) => ({ key: a.key ?? "", value: a.value ?? "" }))
//               : [{ key: "", value: "" }],
//         };
//       });

//       let filtered: any[] = [];
//       const categoryId = selectedProduct.category?.id;
//       if (categoryId) {
//         filtered = options.subCategories.filter((sc: any) => sc.categoryId === String(categoryId));
//       }
//       setFilteredSubCategory(filtered);

//       if (selectedProduct.subCategory?.id) {
//         fetchChildren(String(selectedProduct.subCategory.id));
//       }

//       setFormState({
//         data: {
//           ...selectedProduct,
//           gstRateId: String(selectedProduct.gstRate?.id || ""),
//           dimensionUnit: selectedProduct.dimensionUnit ?? "cm",
//           description: selectedProduct.description ?? "",
//           categoryId: selectedProduct.category ? String(selectedProduct.category.id) : "",
//           subCategoryId: selectedProduct.subCategory ? String(selectedProduct.subCategory.id) : "",
//           childSubCategoryId: selectedProduct.childSubCategory?.id
//             ? String(selectedProduct.childSubCategory.id)
//             : "",
//           originalPrice: safeNum(selectedProduct.originalPrice, 0),
//           finalPrice: safeNum(selectedProduct.price, 0),
//           ...policyFromProduct(selectedProduct),
//           cancelable: selectedProduct.cancelable ?? true,
//           warrantyInfo: selectedProduct.warrantyInfo ?? "",
//         },
//         variants: initialVariants,
//         images: selectedProduct.images || [],
//         newImages: [],
//         removedImageIds: [],
//         loading: false,
//         initialized: true,
//       });
//     } catch (error) {
//       console.error("Error initializing form data:", error);
//     }
//   }, [selectedProduct, formState.initialized, options.subCategories]);

//   useEffect(() => {
//     if (formState.data?.categoryId && options.subCategories.length > 0) {
//       setFilteredSubCategory(
//         options.subCategories.filter((sc) => sc.categoryId === String(formState.data.categoryId))
//       );
//     }
//   }, [formState.data?.categoryId, options.subCategories]);

//   const fetchChildren = async (parentId: string) => {
//     try {
//       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
//       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
//       setOptions((prev) => ({
//         ...prev,
//         subCategoryChildren: children.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//           parentId: String(parentId),
//         })),
//       }));
//     } catch (error) {
//       console.error("Failed to fetch subcategory children:", error);
//       setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//     }
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFilteredSubCategory(options.subCategories.filter((sc) => sc.categoryId === value));
//     setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, categoryId: value, subCategoryId: "", childSubCategoryId: "" },
//     }));
//   };

//   const handleSubCategoryChange = (value: string) => {
//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, subCategoryId: value, childSubCategoryId: "" },
//     }));
//     if (value) fetchChildren(value);
//     else setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//     opts?: { variantIndex?: number; attrIndex?: number; attrField?: "key" | "value" }
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

//     if (opts?.variantIndex !== undefined) {
//       const { variantIndex, attrIndex, attrField } = opts;

//       setFormState((prev) => {
//         const updatedVariants = [...prev.variants];

//         if (attrIndex !== undefined && attrField && updatedVariants[variantIndex]?.attributes[attrIndex]) {
//           updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
//         } else if (name !== "attributes") {
//           (updatedVariants[variantIndex] as any)[name] = value;

//           if (name === "price" || name === "sellingPrice") {
//             const price = name === "price" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].price, 0);
//             let sellingPrice =
//               name === "sellingPrice" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].sellingPrice, 0);

//             if (sellingPrice < 0) sellingPrice = 0;
//             if (sellingPrice > price) sellingPrice = price;

//             updatedVariants[variantIndex].sellingPrice = sellingPrice;
//             updatedVariants[variantIndex].offer =
//               price > 0 ? Math.round(((price - sellingPrice) / price) * 100) : 0;
//           }
//         }
//         return { ...prev, variants: updatedVariants };
//       });
//       return;
//     }

//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, [name]: type === "checkbox" ? checked : value },
//     }));
//   };

//   const setField = (name: string, value: any) =>
//     setFormState((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));

//   const addVariant = () => {
//     setFormState((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         { sku: "", price: 0, sellingPrice: 0, stock: 0, offer: 0, attributes: [{ key: "", value: "" }] },
//       ],
//     }));
//   };

//   const toggleVariants = () => {
//     setShowVariants((prev) => !prev);
//     if (!showVariants && formState.variants.length === 0) addVariant();
//   };

//   const removeVariant = (index: number) => {
//     setFormState((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
//   };

//   const addAttribute = (vIndex: number) => {
//     setFormState((prev) => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[vIndex].attributes.push({ key: "", value: "" });
//       return { ...prev, variants: updatedVariants };
//     });
//   };

//   const removeAttribute = (variantIndex: number, attrIndex: number) => {
//     setFormState((prev) => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[variantIndex].attributes = updatedVariants[variantIndex].attributes.filter(
//         (_, i) => i !== attrIndex
//       );
//       return { ...prev, variants: updatedVariants };
//     });
//   };

//   const handleRemoveImage = (index: number) => {
//     setFormState((prev) => {
//       const imageToRemove = prev.images[index];
//       if (!imageToRemove) return prev;
//       return {
//         ...prev,
//         removedImageIds: imageToRemove.id ? [...prev.removedImageIds, imageToRemove.id] : prev.removedImageIds,
//         images: prev.images.filter((_, i) => i !== index),
//       };
//     });
//   };

//   const handleRemoveNewImage = (index: number) => {
//     setFormState((prev) => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
//   };

//   const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const filesArray = Array.from(e.target.files);
//     const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

//     if (totalImages > 10) {
//       toast.error("Maximum 10 images allowed");
//       return;
//     }

//     const validFiles = filesArray.filter((file) => {
//       if (!file.type.startsWith("image/")) {
//         toast.error(`File ${file.name} is not an image`);
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`Image ${file.name} is too large (max 5MB)`);
//         return false;
//       }
//       return true;
//     });

//     setFormState((prev) => ({ ...prev, newImages: [...prev.newImages, ...validFiles] }));
//     e.target.value = "";
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formState.data) {
//       toast.error("Form data not initialized");
//       return;
//     }
//     if (!formState.data.name?.trim()) {
//       toast.error("Product name is required");
//       return;
//     }
//     if (!formState.data.categoryId) {
//       toast.error("Category is required");
//       return;
//     }
//     if (!showVariants && formState.data.originalPrice <= 0) {
//       toast.error("Original price must be greater than 0");
//       return;
//     }
//     if (showVariants) {
//       const invalidVariant = formState.variants.find((v) => !v.sku?.trim() || v.price <= 0 || v.stock < 0);
//       if (invalidVariant) {
//         toast.error("All variants must have SKU, valid price, and stock");
//         return;
//       }
//     }
//     const policy = policyFromForm(formState.data);
//     const policyIssues = validateReturnPolicy(policy);
//     setPolicyErrors(policyIssues);
//     if (Object.keys(policyIssues).length > 0) {
//       toast.error(Object.values(policyIssues)[0] as string);
//       return;
//     }

//     setFormState((prev) => ({ ...prev, loading: true }));
//     try {
//       const sanitizedVariants = formState.variants
//         .filter((v) => v.sku || v.price || v.stock)
//         .map((v) => ({
//           id: v.id,
//           sku: v.sku?.trim() ?? "",
//           price: safeNum(v.price, 0),
//           sellingPrice: safeNum(
//             v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
//             computeSellingPrice(v.price, v.offer ?? 0)
//           ),
//           offer: safeNum(v.offer ?? 0, 0),
//           stock: safeNum(v.stock, 0),
//           attributes: (v.attributes || [])
//             .filter((a) => a.key?.trim() && a.value?.trim())
//             .map((a) => ({ key: a.key?.trim() ?? "", value: a.value?.trim() ?? "" })),
//         }));

//       const hasVariants = showVariants && sanitizedVariants.length > 0;
//       const productData = new FormData();

//       productData.append("name", formState.data.name?.trim() || "");
//       productData.append("description", formState.data.description?.trim() || "");
//       productData.append("slug", formState.data.slug?.trim() || "");
//       productData.append("categoryId", String(formState.data.categoryId ?? 0));
//       if (formState.data.subCategoryId) productData.append("subCategoryId", formState.data.subCategoryId);
//       productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
//       productData.append("originalPrice", String(formState.data.originalPrice || 0));
//       productData.append("finalPrice", String(formState.data.finalPrice || 0));
//       productData.append("hsnCode", String(formState.data.hsnCode));
//       productData.append("gstRateId", String(formState.data.gstRateId));
//       productData.append("price", String(hasVariants ? 0 : formState.data.finalPrice || 0));
//       productData.append("material", formState.data.material?.trim() || "");
//       productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
//       productData.append("length", String(formState.data.length ?? 0));
//       productData.append("height", String(formState.data.height ?? 0));
//       productData.append("width", String(formState.data.width ?? 0));
//       productData.append("weight", String(formState.data.weight ?? 0));
//       productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
//       productData.append("dimensionUnit", formState.data.dimensionUnit || "cm");
//       productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
//       productData.append("skuCode", formState.data.skuCode?.trim() || "");

//       Object.entries(policyToPayload(policy)).forEach(([key, value]) => productData.append(key, value));

//       productData.append("cancelable", String(formState.data.cancelable ?? true));
//       productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
//       productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
//       productData.append("hasVariants", String(hasVariants));
//       productData.append("isActive", String(isActive));
//       productData.append("keywords", JSON.stringify(formState.data.keywords || []));

//       if (hasVariants) productData.append("variants", JSON.stringify(sanitizedVariants));

//       if (formState.removedImageIds.length > 0) {
//         productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
//       }
//       formState.newImages.forEach((file) => productData.append("images", file));

//       const updatedProduct = await updateProductById(formState.data.id, productData);

//       if (selectedVariants.length > 0) {
//         await updateProductGroup(formState.data.id, selectedVariants.map((v) => v.id));
//       }

//       const updatedList = products.map((p) => (p.id === formState.data.id ? updatedProduct : p));
//       dispatch(setProducts(updatedList));
//       dispatch(setSelectedProduct(updatedProduct));

//       toast.success("Product updated successfully");
//       router.push("/product");
//       setFormState((prev) => ({ ...prev, newImages: [], removedImageIds: [], loading: false }));
//     } catch (err: any) {
//       console.error("Update error:", err);
//       toast.error(err.message || "Update failed");
//       setFormState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   if (!formState.data || options.loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="flex flex-col items-center gap-3 text-gray-600">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//           <span className="text-sm font-medium">Loading product…</span>
//         </div>
//       </div>
//     );
//   }

//   const d = formState.data;
//   const totalImages = formState.images.length + formState.newImages.length;

//   return (
//     <div className="min-h-screen bg-slate-50/50 pb-12">
//       <form onSubmit={handleSubmit} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
//         {/* Sticky action bar */}
//         <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm">
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
//               aria-label="Go back"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </button>
//             <div className="min-w-0">
//               <h1 className="truncate text-lg font-semibold text-gray-900">{d.name || "Edit product"}</h1>
//               <p className="text-xs text-gray-500">SKU {d.skuCode || "—"}</p>
//             </div>
//             <span
//               className={`ml-2 hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex items-center gap-1.5 ${
//                 isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
//               }`}
//             >
//               <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
//               {isActive ? "Active" : "Inactive"}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//             >
//               Discard
//             </button>
//             <button
//               type="submit"
//               disabled={formState.loading}
//               className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {formState.loading && <Loader2 className="h-4 w-4 animate-spin" />}
//               {formState.loading ? "Saving…" : "Save changes"}
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//           {/* ============ MAIN COLUMN ============ */}
//           <div className="space-y-6 lg:col-span-8">
//             {/* Basic info */}
//             <Card title="Basic information" description="Name, SKU and description customers will see" icon={FileText}>
//               <div className="space-y-5">
//                 <div>
//                   <Label>
//                     Product name
//                     <Req />
//                   </Label>
//                   <Input type="text" name="name" placeholder="e.g. Cotton bath towel" value={d.name || ""} onChange={handleChange} />
//                 </div>
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <div>
//                     <Label>
//                       SKU code
//                       <Req />
//                     </Label>
//                     <Input type="text" name="skuCode" placeholder="Enter SKU code" value={d.skuCode || ""} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       Material
//                       <Req />
//                     </Label>
//                     <Input type="text" name="material" placeholder="e.g. Cotton" value={d.material || ""} onChange={handleChange} />
//                   </div>
//                 </div>
//                 <div>
//                   <Label>Description</Label>
//                   <RichTextEditor value={d.description || ""} onChange={(value) => setField("description", value)} />
//                 </div>
//               </div>
//             </Card>

//             {/* Media */}
//             <Card
//               title="Media"
//               description={`${totalImages}/10 images · first image is the main photo · max 5MB each`}
//               icon={ImageIcon}
//             >
//               <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//                 {formState.images.map((img, index) => (
//                   <div
//                     key={`existing-${index}`}
//                     className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
//                   >
//                     <img src={imgSrc(img)} alt={`product-${index}`} className="h-full w-full object-cover" />
//                     {index === 0 && (
//                       <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-medium text-white shadow-sm">
//                         Main
//                       </span>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveImage(index)}
//                       className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
//                       aria-label="Remove image"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}

//                 {formState.newImages.map((file, index) => (
//                   <div
//                     key={`new-${index}`}
//                     className="group relative aspect-square overflow-hidden rounded-xl border-2 border-green-400 bg-gray-50"
//                   >
//                     <img src={URL.createObjectURL(file)} alt={`new-${index}`} className="h-full w-full object-cover" />
//                     <span className="absolute left-2 top-2 rounded-md bg-green-600 px-1.5 py-0.5 text-[11px] font-medium text-white shadow-sm">
//                       New
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveNewImage(index)}
//                       className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
//                       aria-label="Remove image"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}

//                 {totalImages < 10 && (
//                   <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 text-gray-500 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
//                     <div className="rounded-full bg-white p-2 shadow-sm">
//                       <Upload className="h-5 w-5" />
//                     </div>
//                     <span className="text-xs font-medium">Add image</span>
//                     <input type="file" accept="image/*" onChange={handleAddImages} className="hidden" multiple />
//                   </label>
//                 )}
//               </div>
//             </Card>

//             {/* Pricing & tax */}
//             <Card
//               title="Pricing & tax"
//               description={showVariants ? "Price is set on each variant below" : "Set price, discount and GST"}
//               icon={IndianRupee}
//             >
//               <div className="space-y-5">
//                 {!showVariants && (
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                     <div>
//                       <Label>
//                         Original price (₹)
//                         <Req />
//                       </Label>
//                       <Input name="originalPrice" type="number" min="0" placeholder="0" value={d.originalPrice || 0} onChange={handleChange} />
//                     </div>
//                     <div>
//                       <Label>
//                         Selling price (₹)
//                         <Req />
//                       </Label>
//                       <Input name="finalPrice" type="number" min="0" placeholder="0" value={d.finalPrice || ""} onChange={handleChange} />
//                     </div>
//                     <div>
//                       <Label>Discount %</Label>
//                       <div className="relative">
//                         <Input
//                           type="number"
//                           value={calculateOfferPercentage(Number(d.originalPrice), Number(d.finalPrice))}
//                           {...({ readOnly: true } as any)}
//                           className="cursor-not-allowed bg-gray-50 font-medium text-gray-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <div>
//                     <Label>
//                       HSN code
//                       <Req />
//                     </Label>
//                     <Input name="hsnCode" placeholder="HSN code" type="number" min="0" value={d.hsnCode || 0} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       GST rate
//                       <Req />
//                     </Label>
//                     <select name="gstRateId" value={d.gstRateId || ""} onChange={handleChange} className={selectClass} required>
//                       <option value="">Select GST rate</option>
//                       {gstRateOptions.map((gst) => (
//                         <option key={gst.id} value={gst.id}>
//                           {gst.totalRate}%
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Inventory */}
//             {!showVariants && (
//               <Card title="Inventory" description="Stock and pack size" icon={Package}>
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <div>
//                     <Label>
//                       Stock quantity
//                       <Req />
//                     </Label>
//                     <Input type="number" name="stock" placeholder="0" value={d.stock || 0} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Pack quantity (optional)</Label>
//                     <Input type="number" min="1" name="packQuantity" placeholder="e.g. 10" value={d.packQuantity || 0} onChange={handleChange} />
//                     <p className="mt-1.5 text-xs text-gray-500">Number of items included in one pack</p>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Variants */}
//             <Card
//               title="Variants"
//               description="Different sizes, colours or other options with their own price and stock"
//               icon={Layers}
//               action={
//                 <button
//                   type="button"
//                   onClick={toggleVariants}
//                   className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
//                     showVariants
//                       ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
//                       : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
//                   }`}
//                 >
//                   {showVariants ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
//                   {showVariants ? "Remove variants" : "Add variants"}
//                 </button>
//               }
//             >
//               {!showVariants ? (
//                 <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 text-center">
//                   <p className="text-sm text-gray-500">This product has no variants. Price and stock are managed above.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-5">
//                   {formState.variants.map((variant, vIndex) => (
//                     <div key={vIndex} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//                       <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
//                         <p className="text-sm font-semibold text-gray-800">Variant {vIndex + 1}</p>
//                         {formState.variants.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeVariant(vIndex)}
//                             className="flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-700"
//                           >
//                             <X className="h-4 w-4" /> Remove
//                           </button>
//                         )}
//                       </div>

//                       <div className="p-4 space-y-4">
//                         <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                           <div className="col-span-2 md:col-span-2">
//                             <Label>
//                               SKU
//                               <Req />
//                             </Label>
//                             <Input name="sku" value={variant.sku} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                           </div>
//                           <div className="col-span-2 md:col-span-2">
//                             <Label>
//                               Stock
//                               <Req />
//                             </Label>
//                             <Input name="stock" type="number" value={variant.stock} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                           </div>
//                           <div>
//                             <Label>
//                               Price (₹)
//                               <Req />
//                             </Label>
//                             <Input name="price" type="number" value={variant.price} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                           </div>
//                           <div>
//                             <Label>Selling price (₹)</Label>
//                             <Input
//                               name="sellingPrice"
//                               type="number"
//                               value={variant.sellingPrice || 0}
//                               onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                             />
//                           </div>
//                           <div>
//                             <Label>Discount %</Label>
//                             <Input
//                               type="number"
//                               value={
//                                 variant.price && variant.sellingPrice
//                                   ? Math.round(((variant.price - variant.sellingPrice) / variant.price) * 100)
//                                   : 0
//                               }
//                               {...({ readOnly: true } as any)}
//                               className="cursor-not-allowed bg-gray-50 text-gray-500"
//                             />
//                           </div>
//                         </div>

//                         <div className="pt-4 border-t border-gray-100">
//                           <div className="flex items-center justify-between mb-3">
//                             <p className="text-sm font-medium text-gray-700">Attributes</p>
//                             <button
//                               type="button"
//                               onClick={() => addAttribute(vIndex)}
//                               className="flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700"
//                             >
//                               <Plus className="h-3.5 w-3.5" /> Add attribute
//                             </button>
//                           </div>
                          
//                           <div className="space-y-3">
//                             {variant.attributes.map((attr, aIndex) => (
//                               <div key={aIndex} className="flex items-end gap-3">
//                                 <div className="flex-1">
//                                   <Label>Name</Label>
//                                   <Input
//                                     value={attr.key}
//                                     placeholder="e.g. Colour"
//                                     onChange={(e) =>
//                                       handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "key" })
//                                     }
//                                   />
//                                 </div>
//                                 <div className="flex-1">
//                                   <Label>Value</Label>
//                                   <Input
//                                     value={attr.value}
//                                     placeholder="e.g. Red"
//                                     onChange={(e) =>
//                                       handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "value" })
//                                     }
//                                   />
//                                 </div>
//                                 {variant.attributes.length > 1 && (
//                                   <button
//                                     type="button"
//                                     onClick={() => removeAttribute(vIndex, aIndex)}
//                                     className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
//                                     aria-label="Remove attribute"
//                                   >
//                                     <X className="h-4 w-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   <button
//                     type="button"
//                     onClick={addVariant}
//                     className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-sm font-medium text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
//                   >
//                     <Plus className="h-4 w-4" /> Add another variant
//                   </button>
//                 </div>
//               )}
//             </Card>

//             {/* Shipping */}
//             <Card title="Shipping" description="Package size, weight and delivery options" icon={Truck}>
//               <div className="space-y-5">
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                   <div>
//                     <Label>
//                       Length (cm)
//                       <Req />
//                     </Label>
//                     <Input type="text" name="length" placeholder="0" value={d.length || ""} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       Width (cm)
//                       <Req />
//                     </Label>
//                     <Input type="text" name="width" placeholder="0" value={d.width || ""} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       Height (cm)
//                       <Req />
//                     </Label>
//                     <Input type="text" name="height" placeholder="0" value={d.height || ""} onChange={handleChange} />
//                   </div>
//                 </div>

//                 <div className="max-w-xs">
//                   <Label>
//                     Weight
//                     <Req />
//                   </Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="number"
//                       name="weight"
//                       placeholder="0"
//                       value={d.weight || ""}
//                       onChange={handleChange}
//                       className="w-full"
//                       min="0"
//                     />
//                     <select name="weightUnit" value={d.weightUnit || "kg"} onChange={handleChange} className={`${selectClass} !w-24`}>
//                       <option value="kg">kg</option>
//                       <option value="g">g</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                   <ToggleRow
//                     title="Shipping available"
//                     hint="Allow this product to be delivered"
//                     checked={d.shippingAvailable ?? false}
//                     onChange={(v) => setField("shippingAvailable", v)}
//                   />
//                   <ToggleRow
//                     title="Cash on delivery"
//                     hint="Let customers pay on delivery"
//                     checked={d.codAvailable ?? false}
//                     onChange={(v) => setField("codAvailable", v)}
//                   />
//                 </div>
//               </div>
//             </Card>

//             {/* Policies */}
//             <Card title="Policies" description="Returns, replacement, cancellation and warranty" icon={ShieldCheck}>
//               <div className="space-y-5">
//                 <ReturnReplacementPolicyFields
//                   value={policyFromForm(d)}
//                   errors={policyErrors}
//                   onChange={(patch) => {
//                     setFormState((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
//                     setPolicyErrors((prev) => {
//                       const next = { ...prev };
//                       (Object.keys(patch) as (keyof ReturnReplacementPolicy)[]).forEach((k) => delete next[k]);
//                       return next;
//                     });
//                   }}
//                 />

//                 <ToggleRow
//                   title="Customer can cancel before dispatch"
//                   hint="When off, customers can't cancel orders with this product. Staff can still cancel with a reason."
//                   checked={d.cancelable !== false}
//                   onChange={(v) => setField("cancelable", v)}
//                 />

//                 <div>
//                   <Label>Warranty info</Label>
//                   <TextArea
//                     name="warrantyInfo"
//                     placeholder="e.g. 1-year manufacturer warranty"
//                     value={d.warrantyInfo || ""}
//                     onChange={handleChange}
//                     rows={3}
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* ============ SIDEBAR ============ */}
//           <aside className="space-y-6 lg:col-span-4">
//             {/* Status */}
//             <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-gray-900">Status</h2>
//                   <p className="mt-0.5 text-xs text-gray-500">
//                     {isActive ? "Visible on the storefront" : "Hidden from the storefront"}
//                   </p>
//                 </div>
//                 <Switch checked={isActive} onChange={setIsActive} label="Toggle product status" />
//               </div>
//             </section>

//             {/* Organisation */}
//             <Card title="Organisation" description="Where this product is listed" icon={FolderTree}>
//               <div className="space-y-4">
//                 <div>
//                   <Label>
//                     Category
//                     <Req />
//                   </Label>
//                   <select
//                     name="categoryId"
//                     value={d.categoryId || ""}
//                     onChange={handleCategoryChange}
//                     className={selectClass}
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {options.categories.map((cat) => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {filteredSubCategory.length > 0 && (
//                   <div>
//                     <Label>Subcategory</Label>
//                     <select
//                       name="subCategoryId"
//                       value={d.subCategoryId || ""}
//                       onChange={(e) => handleSubCategoryChange(e.target.value)}
//                       className={selectClass}
//                     >
//                       <option value="">Select subcategory</option>
//                       {filteredSubCategory.map((sub) => (
//                         <option key={sub.value} value={sub.value}>
//                           {sub.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {options.subCategoryChildren.length > 0 && (
//                   <div>
//                     <Label>Child category</Label>
//                     <select
//                       name="childSubCategoryId"
//                       value={d.childSubCategoryId || ""}
//                       onChange={handleChange}
//                       className={selectClass}
//                     >
//                       <option value="">Select child category</option>
//                       {options.subCategoryChildren.map((child) => (
//                         <option key={child.value} value={child.value}>
//                           {child.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* Keywords */}
//             <Card title="Search keywords" description="Help customers find this product" icon={Tag}>
//               <ChipInput
//                 value={d.keywords || []}
//                 onChange={(keywords) => setFormState((prev) => ({ ...prev, data: { ...prev.data, keywords } }))}
//                 placeholder="Type a keyword and press Enter"
//               />
//             </Card>

//             {/* Linked products */}
//             <Card
//               title="Linked products"
//               description="Show other products as options (e.g. other colours)"
//               icon={Link2}
//             >
//               <div className="relative">
//                 <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by SKU…"
//                   value={skuSearch}
//                   onChange={(e) => handleSkuSearch(e.target.value)}
//                   className="!pl-9"
//                 />
//                 {searchResults.length > 0 && (
//                   <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
//                     {searchResults.map((p) => (
//                       <button
//                         type="button"
//                         key={p.id}
//                         onClick={() => handleAddVariant(p)}
//                         className="flex w-full items-center gap-3 border-b border-gray-50 px-3 py-2 text-left transition last:border-0 hover:bg-gray-50"
//                       >
//                         <img
//                           src={p.images?.[0]?.imageUrl || "/no-image.png"}
//                           alt={p.name || "Product"}
//                           className="h-10 w-10 rounded-lg object-cover border border-gray-100"
//                         />
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
//                           <p className="text-xs text-gray-500">{p.skuCode}</p>
//                         </div>
//                         <Plus className="h-4 w-4 text-blue-600" />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {selectedVariants.length > 0 ? (
//                 <ul className="mt-4 space-y-2">
//                   {selectedVariants.map((v) => (
//                     <li key={v.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-2 transition hover:bg-white hover:shadow-sm">
//                       <img
//                         src={
//                           v.images?.[0]?.large ||
//                           v.images?.[0]?.medium ||
//                           v.images?.[0]?.thumbnail ||
//                           v.images?.[0]?.imageUrl ||
//                           "/no-image.png"
//                         }
//                         alt={v.name || "Linked product"}
//                         className="h-12 w-12 rounded-lg border border-gray-100 object-cover"
//                       />
//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-medium text-gray-900">{v.name}</p>
//                         <p className="text-xs text-gray-500">{v.skuCode}</p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveVariant(v.id)}
//                         className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
//                         aria-label="Remove linked product"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="mt-4 text-center text-xs text-gray-400 py-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">No linked products yet.</p>
//               )}
//             </Card>
//           </aside>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditProductPage;



// "use client";
// import {
//   fetchProductsByGroup,
//   updateProductGroup,
//   fetchProductById,
//   updateProductById,
// } from "@/services/product/productService";
// import { toast } from "react-toastify";
// import { useParams, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { getAllGstRatesAPI } from "@/components/features/gst/service/gst.api";
// import { GstRate } from "@/components/features/gst/type/gst.types";
// import Input from "../../../../../../components/form/input/InputField";
// import Label from "../../../../../../components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import RichTextEditor from "@/components/form/input/RichTextEditor";
// import ChipInput from "@/components/form/input/ChipInput";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setSelectedProduct, setProducts } from "@/redux/productSlice";
// import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// import { Variant } from "@/components/types/product";
// import { apiConnector } from "@/services/apiConnector";
// import { calculateOfferPercentage } from "@/utils/priceUtils";
// import ReturnReplacementPolicyFields from "@/components/products/ReturnReplacementPolicyFields";
// import {
//   PolicyErrors,
//   ReturnReplacementPolicy,
//   policyFromProduct,
//   policyToPayload,
//   validateReturnPolicy,
// } from "@/validations/returnPolicy";
// import {
//   ArrowLeft,
//   X,
//   Plus,
//   Upload,
//   Search,
//   Package,
//   IndianRupee,
//   Truck,
//   Layers,
//   ImageIcon,
//   FileText,
//   ShieldCheck,
//   Tag,
//   FolderTree,
//   Link2,
//   Loader2,
// } from "lucide-react";

// type ProductImageType = {
//   id: number;
//   imageUrl: string;
//   thumbnail?: string;
//   medium?: string;
//   large?: string;
// };
// type SubCategoryOption = { value: string; label: string; categoryId: string };
// type ProductLite = {
//   id: number;
//   name: string;
//   skuCode: string;
//   variantGroupId?: number;
//   images?: ProductImageType[];
// };

// // ---------- Utils ----------
// const safeNum = (v: any, fallback = 0): number => {
//   const n = Number(v);
//   return isNaN(n) ? fallback : n;
// };

// const computeSellingPrice = (price: number, offer: number): number => {
//   const priceNum = safeNum(price, 0);
//   const offerNum = safeNum(offer, 0);
//   return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
// };

// const policyFromForm = (data: any): ReturnReplacementPolicy => ({
//   returnEligible: data?.returnEligible === true,
//   returnWindowDays: Number(data?.returnWindowDays) || 0,
//   replacementEligible: data?.replacementEligible === true,
//   replacementWindowDays: Number(data?.replacementWindowDays) || 0,
//   returnPolicyConditions: data?.returnPolicyConditions ?? "",
// });

// // ---------- UI primitives (design system: flat, border-gray-200, rounded-[10px]) ----------
// const selectClass =
//   "w-full h-11 rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700";

// const Card = ({
//   title,
//   description,
//   icon: Icon,
//   action,
//   children,
// }: {
//   title: string;
//   description?: string;
//   icon: React.ElementType;
//   action?: React.ReactNode;
//   children: React.ReactNode;
// }) => (
//   <section className="rounded-[10px] border border-gray-200 bg-white">
//     <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
//       <div className="flex items-center gap-3">
//         <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100">
//           <Icon className="h-[18px] w-[18px] text-gray-600" />
//         </div>
//         <div>
//           <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
//           {description && <p className="text-xs text-gray-500">{description}</p>}
//         </div>
//       </div>
//       {action}
//     </header>
//     <div className="p-5">{children}</div>
//   </section>
// );

// const Req = () => <span className="text-red-500"> *</span>;

// const Switch = ({
//   checked,
//   onChange,
//   label,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
// }) => (
//   <button
//     type="button"
//     role="switch"
//     aria-checked={checked}
//     aria-label={label}
//     onClick={() => onChange(!checked)}
//     className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
//       checked ? "bg-green-600" : "bg-gray-300"
//     }`}
//   >
//     <span
//       className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// const ToggleRow = ({
//   title,
//   hint,
//   checked,
//   onChange,
// }: {
//   title: string;
//   hint: string;
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) => (
//   <div className="flex items-center justify-between gap-4 rounded-[10px] border border-gray-200 p-4">
//     <div>
//       <p className="text-sm font-medium text-gray-900">{title}</p>
//       <p className="text-xs text-gray-500">{hint}</p>
//     </div>
//     <Switch checked={checked} onChange={onChange} label={title} />
//   </div>
// );

// const imgSrc = (img: any) =>
//   typeof img === "string"
//     ? img
//     : img?.imageUrl || img?.large || img?.medium || img?.thumbnail || "/no-image.png";

// // ---------- Page ----------
// const EditProductPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const [policyErrors, setPolicyErrors] = useState<PolicyErrors>({});
//   const { id } = useParams();
//   const router = useRouter();

//   const { selectedProduct, products } = useSelector((state: RootState) => state.product);

//   const [formState, setFormState] = useState({
//     data: null as any,
//     variants: [] as Variant[],
//     images: [] as ProductImageType[],
//     newImages: [] as File[],
//     removedImageIds: [] as number[],
//     loading: false,
//     initialized: false,
//   });
//   const [options, setOptions] = useState({
//     categories: [] as { value: string; label: string }[],
//     subCategories: [] as SubCategoryOption[],
//     subCategoryChildren: [] as { value: string; label: string }[],
//     loading: true,
//   });
//   const [skuSearch, setSkuSearch] = useState("");
//   const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
//   const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
//   const [showVariants, setShowVariants] = useState(false);
//   const [isActive, setIsActive] = useState(true);
//   const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);
//   const [gstRateOptions, setGstRateOptions] = useState<GstRate[]>([]);
//   const [gstFetchError, setGstFetchError] = useState("");

//   // Fetch product by ID
//   useEffect(() => {
//     const loadProduct = async () => {
//       if (!id) return;
//       try {
//         const res = await fetchProductById(Number(id));
//         dispatch(setSelectedProduct(res.product));
//         setIsActive(res.product.isActive ?? true);
//       } catch (error) {
//         console.error("Failed to fetch product:", error);
//         toast.error("Failed to load product");
//       }
//     };
//     loadProduct();
//   }, [id, dispatch]);

//   const handleSkuSearch = async (value: string) => {
//     setSkuSearch(value);
//     if (value.length < 2) {
//       setSearchResults([]);
//       return;
//     }
//     try {
//       const res = await apiConnector("GET", `/search?sku=${value}`);
//       setSearchResults(res.data?.products || []);
//     } catch (err) {
//       console.error(err);
//       setSearchResults([]);
//     }
//   };

//   const handleAddVariant = (product: ProductLite) => {
//     if (selectedVariants.some((v) => v.id === product.id)) {
//       toast.warning("Already added");
//       return;
//     }
//     setSelectedVariants((prev) => [...prev, product]);
//     setSearchResults([]);
//     setSkuSearch("");
//   };

//   const handleRemoveVariant = (pid: number) => {
//     setSelectedVariants((prev) => prev.filter((p) => p.id !== pid));
//   };

//   // Fetch categories, subcategories, GST
//   useEffect(() => {
//     const fetchOptionsData = async () => {
//       try {
//         setOptions((prev) => ({ ...prev, loading: true }));

//         const categoriesRes = await apiConnector("GET", "/category");
//         const subCategoriesRes = await fetchSubCategoryAll();
//         const [gstRes] = await Promise.all([getAllGstRatesAPI()]);

//         const gstList = gstRes.data?.data;
//         setGstRateOptions(Array.isArray(gstList) ? gstList.filter((item: GstRate) => item.isActive) : []);
//         setGstFetchError("");

//         const categories = Array.isArray(categoriesRes.data?.categories)
//           ? categoriesRes.data.categories
//           : [];

//         setOptions((prev) => ({
//           ...prev,
//           categories: categories.map((cat: any) => ({ value: String(cat.id), label: cat.name })),
//           subCategories: subCategoriesRes.map((cat: any) => ({
//             value: String(cat.id),
//             label: cat.name,
//             categoryId: String(cat.category?.id || ""),
//           })),
//           loading: false,
//         }));
//       } catch (err) {
//         console.error("Options fetch error", err);
//         toast.error("Failed to load categories and subcategories");
//         setOptions((prev) => ({ ...prev, loading: false }));
//       }
//     };
//     fetchOptionsData();
//   }, []);

//   // Load grouped (linked) products
//   useEffect(() => {
//     const loadGroupProducts = async () => {
//       if (!selectedProduct?.variantGroupId) {
//         setSelectedVariants([]);
//         return;
//       }
//       try {
//         const list = await fetchProductsByGroup(selectedProduct.variantGroupId);
//         setSelectedVariants(list.filter((p: any) => p.id !== selectedProduct.id));
//       } catch (err) {
//         console.error("Group load error", err);
//       }
//     };
//     loadGroupProducts();
//   }, [selectedProduct]);

//   // Initialise form
//   useEffect(() => {
//     if (!selectedProduct) return;
//     if (formState.initialized) return;

//     try {
//       const initialVariants: Variant[] = (selectedProduct.variants || []).map((v: any) => {
//         const price = safeNum(v.price, 0);
//         const offer = safeNum(v.offer, 0);
//         const sellingPrice = safeNum(v.sellingPrice, computeSellingPrice(price, offer));
//         return {
//           id: v.id,
//           sku: v.sku ?? "",
//           price,
//           sellingPrice,
//           stock: safeNum(v.stock, 0),
//           offer,
//           attributes:
//             (v.attributes || []).length > 0
//               ? v.attributes.map((a: any) => ({ key: a.key ?? "", value: a.value ?? "" }))
//               : [{ key: "", value: "" }],
//         };
//       });

//       let filtered: any[] = [];
//       const categoryId = selectedProduct.category?.id;
//       if (categoryId) {
//         filtered = options.subCategories.filter((sc: any) => sc.categoryId === String(categoryId));
//       }
//       setFilteredSubCategory(filtered);

//       if (selectedProduct.subCategory?.id) {
//         fetchChildren(String(selectedProduct.subCategory.id));
//       }

//       setFormState({
//         data: {
//           ...selectedProduct,
//           hsnCode: String(selectedProduct.hsnCode ?? selectedProduct.hsn?.code ?? selectedProduct.hsn?.hsnCode ?? ""),
//           gstRateId: String(selectedProduct.gstRate?.id ?? selectedProduct.gstRateId ?? ""),
//           dimensionUnit: selectedProduct.dimensionUnit ?? "cm",
//           description: selectedProduct.description ?? "",
//           categoryId: selectedProduct.category ? String(selectedProduct.category.id) : "",
//           subCategoryId: selectedProduct.subCategory ? String(selectedProduct.subCategory.id) : "",
//           childSubCategoryId: selectedProduct.childSubCategory?.id
//             ? String(selectedProduct.childSubCategory.id)
//             : "",
//           originalPrice: safeNum(selectedProduct.originalPrice, 0),
//           finalPrice: safeNum(selectedProduct.price, 0),
//           // Return & Replacement: saved values only (no assumed defaults)
//           ...policyFromProduct(selectedProduct),
//           cancelable: selectedProduct.cancelable ?? true,
//           warrantyInfo: selectedProduct.warrantyInfo ?? "",
//         },
//         variants: initialVariants,
//         images: selectedProduct.images || [],
//         newImages: [],
//         removedImageIds: [],
//         loading: false,
//         initialized: true,
//       });
//     } catch (error) {
//       console.error("Error initializing form data:", error);
//     }
//   }, [selectedProduct, formState.initialized]);

//   useEffect(() => {
//     if (formState.data?.categoryId && options.subCategories.length > 0) {
//       setFilteredSubCategory(
//         options.subCategories.filter((sc) => sc.categoryId === String(formState.data.categoryId))
//       );
//     }
//   }, [formState.data?.categoryId, options.subCategories]);

//   const fetchChildren = async (parentId: string) => {
//     try {
//       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
//       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
//       setOptions((prev) => ({
//         ...prev,
//         subCategoryChildren: children.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//           parentId: String(parentId),
//         })),
//       }));
//     } catch (error) {
//       console.error("Failed to fetch subcategory children:", error);
//       setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//     }
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFilteredSubCategory(options.subCategories.filter((sc) => sc.categoryId === value));
//     setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, categoryId: value, subCategoryId: "", childSubCategoryId: "" },
//     }));
//   };

//   const handleSubCategoryChange = (value: string) => {
//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, subCategoryId: value, childSubCategoryId: "" },
//     }));
//     if (value) fetchChildren(value);
//     else setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
//   };

//   // Generic change handler (form fields + variant fields)
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//     opts?: { variantIndex?: number; attrIndex?: number; attrField?: "key" | "value" }
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

//     if (opts?.variantIndex !== undefined) {
//       const { variantIndex, attrIndex, attrField } = opts;

//       setFormState((prev) => {
//         const updatedVariants = [...prev.variants];

//         if (attrIndex !== undefined && attrField && updatedVariants[variantIndex]?.attributes[attrIndex]) {
//           updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
//         } else if (name !== "attributes") {
//           (updatedVariants[variantIndex] as any)[name] = value;

//           if (name === "price" || name === "sellingPrice") {
//             const price = name === "price" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].price, 0);
//             let sellingPrice =
//               name === "sellingPrice" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].sellingPrice, 0);

//             if (sellingPrice < 0) sellingPrice = 0;
//             if (sellingPrice > price) sellingPrice = price;

//             updatedVariants[variantIndex].sellingPrice = sellingPrice;
//             updatedVariants[variantIndex].offer =
//               price > 0 ? Math.round(((price - sellingPrice) / price) * 100) : 0;
//           }
//         }
//         return { ...prev, variants: updatedVariants };
//       });
//       return;
//     }

//     setFormState((prev) => ({
//       ...prev,
//       data: { ...prev.data, [name]: type === "checkbox" ? checked : value },
//     }));
//   };

//   const setField = (name: string, value: any) =>
//     setFormState((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));

//   // Variants
//   const addVariant = () => {
//     setFormState((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         { sku: "", price: 0, sellingPrice: 0, stock: 0, offer: 0, attributes: [{ key: "", value: "" }] },
//       ],
//     }));
//   };

//   const toggleVariants = () => {
//     setShowVariants((prev) => !prev);
//     if (!showVariants && formState.variants.length === 0) addVariant();
//   };

//   const removeVariant = (index: number) => {
//     setFormState((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
//   };

//   const addAttribute = (vIndex: number) => {
//     setFormState((prev) => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[vIndex].attributes.push({ key: "", value: "" });
//       return { ...prev, variants: updatedVariants };
//     });
//   };

//   const removeAttribute = (variantIndex: number, attrIndex: number) => {
//     setFormState((prev) => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[variantIndex].attributes = updatedVariants[variantIndex].attributes.filter(
//         (_, i) => i !== attrIndex
//       );
//       return { ...prev, variants: updatedVariants };
//     });
//   };

//   // Images
//   const handleRemoveImage = (index: number) => {
//     setFormState((prev) => {
//       const imageToRemove = prev.images[index];
//       if (!imageToRemove) return prev;
//       return {
//         ...prev,
//         removedImageIds: imageToRemove.id ? [...prev.removedImageIds, imageToRemove.id] : prev.removedImageIds,
//         images: prev.images.filter((_, i) => i !== index),
//       };
//     });
//   };

//   const handleRemoveNewImage = (index: number) => {
//     setFormState((prev) => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
//   };

//   const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const filesArray = Array.from(e.target.files);
//     const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

//     if (totalImages > 10) {
//       toast.error("Maximum 10 images allowed");
//       return;
//     }

//     const validFiles = filesArray.filter((file) => {
//       if (!file.type.startsWith("image/")) {
//         toast.error(`File ${file.name} is not an image`);
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`Image ${file.name} is too large (max 5MB)`);
//         return false;
//       }
//       return true;
//     });

//     setFormState((prev) => ({ ...prev, newImages: [...prev.newImages, ...validFiles] }));
//     e.target.value = "";
//   };

//   // Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formState.data) {
//       toast.error("Form data not initialized");
//       return;
//     }
//     if (!formState.data.name?.trim()) {
//       toast.error("Product name is required");
//       return;
//     }
//     if (!formState.data.categoryId) {
//       toast.error("Category is required");
//       return;
//     }
//     if (!String(formState.data.hsnCode ?? "").trim()) {
//       toast.error("HSN code is required");
//       return;
//     }
//     if (!formState.data.gstRateId) {
//       toast.error("GST rate is required");
//       return;
//     }
//     if (!showVariants && formState.data.originalPrice <= 0) {
//       toast.error("Original price must be greater than 0");
//       return;
//     }
//     if (showVariants) {
//       const invalidVariant = formState.variants.find((v) => !v.sku?.trim() || v.price <= 0 || v.stock < 0);
//       if (invalidVariant) {
//         toast.error("All variants must have SKU, valid price, and stock");
//         return;
//       }
//     }
//     const policy = policyFromForm(formState.data);
//     const policyIssues = validateReturnPolicy(policy);
//     setPolicyErrors(policyIssues);
//     if (Object.keys(policyIssues).length > 0) {
//       toast.error(Object.values(policyIssues)[0] as string);
//       return;
//     }

//     setFormState((prev) => ({ ...prev, loading: true }));
//     try {
//       const sanitizedVariants = formState.variants
//         .filter((v) => v.sku || v.price || v.stock)
//         .map((v) => ({
//           id: v.id,
//           sku: v.sku?.trim() ?? "",
//           price: safeNum(v.price, 0),
//           sellingPrice: safeNum(
//             v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
//             computeSellingPrice(v.price, v.offer ?? 0)
//           ),
//           offer: safeNum(v.offer ?? 0, 0),
//           stock: safeNum(v.stock, 0),
//           attributes: (v.attributes || [])
//             .filter((a) => a.key?.trim() && a.value?.trim())
//             .map((a) => ({ key: a.key?.trim() ?? "", value: a.value?.trim() ?? "" })),
//         }));

//       const hasVariants = showVariants && sanitizedVariants.length > 0;
//       const productData = new FormData();

//       productData.append("name", formState.data.name?.trim() || "");
//       productData.append("description", formState.data.description?.trim() || "");
//       productData.append("slug", formState.data.slug?.trim() || "");
//       productData.append("categoryId", String(formState.data.categoryId ?? 0));
//       if (formState.data.subCategoryId) productData.append("subCategoryId", formState.data.subCategoryId);
//       productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
//       productData.append("originalPrice", String(formState.data.originalPrice || 0));
//       productData.append("finalPrice", String(formState.data.finalPrice || 0));
//       productData.append("hsnCode", String(formState.data.hsnCode ?? "").trim());
//       productData.append("gstRateId", String(formState.data.gstRateId));
//       productData.append("price", String(hasVariants ? 0 : formState.data.finalPrice || 0));
//       productData.append("material", formState.data.material?.trim() || "");
//       productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
//       productData.append("length", String(formState.data.length ?? 0));
//       productData.append("height", String(formState.data.height ?? 0));
//       productData.append("width", String(formState.data.width ?? 0));
//       productData.append("weight", String(formState.data.weight ?? 0));
//       productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
//       productData.append("dimensionUnit", formState.data.dimensionUnit || "cm");
//       productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
//       productData.append("skuCode", formState.data.skuCode?.trim() || "");

//       Object.entries(policyToPayload(policy)).forEach(([key, value]) => productData.append(key, value));

//       productData.append("cancelable", String(formState.data.cancelable ?? true));
//       productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
//       productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
//       productData.append("hasVariants", String(hasVariants));
//       productData.append("isActive", String(isActive));
//       productData.append("keywords", JSON.stringify(formState.data.keywords || []));

//       if (hasVariants) productData.append("variants", JSON.stringify(sanitizedVariants));

//       if (formState.removedImageIds.length > 0) {
//         productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
//       }
//       formState.newImages.forEach((file) => productData.append("images", file));

//       const updatedProduct = await updateProductById(formState.data.id, productData);

//       if (selectedVariants.length > 0) {
//         await updateProductGroup(formState.data.id, selectedVariants.map((v) => v.id));
//       }

//       const updatedList = products.map((p) => (p.id === formState.data.id ? updatedProduct : p));
//       dispatch(setProducts(updatedList));
//       dispatch(setSelectedProduct(updatedProduct));

//       toast.success("Product updated successfully");
//       router.push("/product");
//       setFormState((prev) => ({ ...prev, newImages: [], removedImageIds: [], loading: false }));
//     } catch (err: any) {
//       console.error("Update error:", err);
//       toast.error(err.message || "Update failed");
//       setFormState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   // Loading state
//   if (!formState.data || options.loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="flex items-center gap-3 text-gray-600">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           <span className="text-sm font-medium">Loading product…</span>
//         </div>
//       </div>
//     );
//   }

//   const d = formState.data;
//   const totalImages = formState.images.length + formState.newImages.length;

//   return (
//     <form onSubmit={handleSubmit} className="mx-auto w-full lg:w-11/12">
//       {/* Sticky action bar */}
//       <div className="sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
//         <div className="flex min-w-0 items-center gap-3">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-gray-200 text-gray-600 hover:bg-gray-100"
//             aria-label="Go back"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </button>
//           <div className="min-w-0">
//             <h1 className="truncate text-lg font-semibold text-gray-900">{d.name || "Edit product"}</h1>
//             <p className="text-xs text-gray-500">Edit product · SKU {d.skuCode || "—"}</p>
//           </div>
//           <span
//             className={`ml-1 hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-block ${
//               isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {isActive ? "Active" : "Inactive"}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="h-10 rounded-[10px] border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             Discard
//           </button>
//           <button
//             type="submit"
//             disabled={formState.loading}
//             className="flex h-10 items-center gap-2 rounded-[10px] bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {formState.loading && <Loader2 className="h-4 w-4 animate-spin" />}
//             {formState.loading ? "Saving…" : "Save changes"}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-3">
//         {/* ============ MAIN COLUMN ============ */}
//         <div className="space-y-6 lg:col-span-2">
//           {/* Basic info */}
//           <Card title="Basic information" description="Name, SKU and description customers will see" icon={FileText}>
//             <div className="space-y-4">
//               <div>
//                 <Label>
//                   Product name
//                   <Req />
//                 </Label>
//                 <Input type="text" name="name" placeholder="e.g. Cotton bath towel" value={d.name || ""} onChange={handleChange} />
//               </div>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <Label>
//                     SKU code
//                     <Req />
//                   </Label>
//                   <Input type="text" name="skuCode" placeholder="Enter SKU code" value={d.skuCode || ""} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>
//                     Material
//                     <Req />
//                   </Label>
//                   <Input type="text" name="material" placeholder="e.g. Cotton" value={d.material || ""} onChange={handleChange} />
//                 </div>
//               </div>
//               <div>
//                 <Label>Description</Label>
//                 <RichTextEditor value={d.description || ""} onChange={(value) => setField("description", value)} />
//               </div>
//             </div>
//           </Card>

//           {/* Media */}
//           <Card
//             title="Media"
//             description={`${totalImages}/10 images · first image is the main photo · max 5MB each`}
//             icon={ImageIcon}
//           >
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
//               {formState.images.map((img, index) => (
//                 <div
//                   key={`existing-${index}`}
//                   className="group relative aspect-square overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50"
//                 >
//                   <img src={imgSrc(img)} alt={`product-${index}`} className="h-full w-full object-cover" />
//                   {index === 0 && (
//                     <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
//                       Main
//                     </span>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(index)}
//                     className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
//                     aria-label="Remove image"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}

//               {formState.newImages.map((file, index) => (
//                 <div
//                   key={`new-${index}`}
//                   className="group relative aspect-square overflow-hidden rounded-[10px] border-2 border-green-300"
//                 >
//                   <img src={URL.createObjectURL(file)} alt={`new-${index}`} className="h-full w-full object-cover" />
//                   <span className="absolute left-2 top-2 rounded-md bg-green-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
//                     New
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveNewImage(index)}
//                     className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
//                     aria-label="Remove image"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}

//               {totalImages < 10 && (
//                 <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600">
//                   <Upload className="h-6 w-6" />
//                   <span className="text-xs font-medium">Add images</span>
//                   <input type="file" accept="image/*" onChange={handleAddImages} className="hidden" multiple />
//                 </label>
//               )}
//             </div>
//           </Card>

//           {/* Pricing & tax */}
//           <Card
//             title="Pricing & tax"
//             description={showVariants ? "Price is set on each variant below" : "Set price, discount and GST"}
//             icon={IndianRupee}
//           >
//             <div className="space-y-4">
//               {!showVariants && (
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                   <div>
//                     <Label>
//                       Original price (₹)
//                       <Req />
//                     </Label>
//                     <Input name="originalPrice" type="number" min="0" placeholder="0" value={d.originalPrice || 0} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       Selling price (₹)
//                       <Req />
//                     </Label>
//                     <Input name="finalPrice" type="number" min="0" placeholder="0" value={d.finalPrice || ""} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Discount %</Label>
//                     <Input
//                       type="number"
//                       value={calculateOfferPercentage(Number(d.originalPrice), Number(d.finalPrice))}
//                       {...({ readOnly: true } as any)}
//                       className="cursor-not-allowed bg-gray-100"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Tax information (GST) */}
//               <div className="space-y-4 border-t border-gray-200 pt-4">
//                 <h3 className="text-sm font-semibold text-gray-800">Tax information (GST)</h3>

//                 {gstFetchError && <p className="text-sm text-red-600">{gstFetchError}</p>}

//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <div>
//                     <Label>
//                       HSN code
//                       <Req />
//                     </Label>
//                     <Input name="hsnCode" type="text" placeholder="Enter HSN code" value={d.hsnCode ?? ""} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>
//                       GST rate
//                       <Req />
//                     </Label>
//                     <select name="gstRateId" value={d.gstRateId || ""} onChange={handleChange} className={selectClass} required>
//                       <option value="">Select GST rate</option>
//                       {gstRateOptions.map((gst) => (
//                         <option key={gst.id} value={String(gst.id)}>
//                           {gst.rateName} ({gst.totalRate}%)
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {(() => {
//                   const selectedRate = gstRateOptions.find((g) => String(g.id) === String(d.gstRateId));
//                   if (!selectedRate) return null;
//                   return (
//                     <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-4">
//                       <h4 className="mb-3 text-sm font-semibold text-gray-800">Selected GST details</h4>
//                       <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//                         {[
//                           ["Total GST", selectedRate.totalRate],
//                           ["CGST", selectedRate.cgstRate],
//                           ["SGST", selectedRate.sgstRate],
//                           ["IGST", selectedRate.igstRate],
//                         ].map(([label, val]) => (
//                           <div key={label as string}>
//                             <p className="text-xs text-gray-500">{label}</p>
//                             <p className="font-semibold text-gray-900">{val}%</p>
//                           </div>
//                         ))}
//                       </div>
//                       <p className="mt-3 text-xs text-blue-700">
//                         Product price is GST-inclusive. Tax is calculated from the final selling price.
//                       </p>
//                     </div>
//                   );
//                 })()}
//               </div>
//             </div>
//           </Card>

//           {/* Inventory */}
//           {!showVariants && (
//             <Card title="Inventory" description="Stock and pack size" icon={Package}>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <Label>
//                     Stock quantity
//                     <Req />
//                   </Label>
//                   <Input type="number" name="stock" placeholder="0" value={d.stock || 0} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Pack quantity (optional)</Label>
//                   <Input type="number" min="1" name="packQuantity" placeholder="e.g. 10" value={d.packQuantity || 0} onChange={handleChange} />
//                   <p className="mt-1 text-xs text-gray-500">Number of items included in one pack</p>
//                 </div>
//               </div>
//             </Card>
//           )}

//           {/* Variants */}
//           <Card
//             title="Variants"
//             description="Different sizes, colours or other options with their own price and stock"
//             icon={Layers}
//             action={
//               <button
//                 type="button"
//                 onClick={toggleVariants}
//                 className={`flex h-9 items-center gap-1.5 rounded-[10px] border px-3 text-sm font-medium ${
//                   showVariants
//                     ? "border-red-200 text-red-600 hover:bg-red-50"
//                     : "border-gray-200 text-blue-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {showVariants ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
//                 {showVariants ? "Remove variants" : "Add variants"}
//               </button>
//             }
//           >
//             {!showVariants ? (
//               <p className="text-sm text-gray-500">This product has no variants. Price and stock are managed above.</p>
//             ) : (
//               <div className="space-y-4">
//                 {formState.variants.map((variant, vIndex) => (
//                   <div key={vIndex} className="rounded-[10px] border border-gray-200 bg-gray-50/50 p-4">
//                     <div className="mb-4 flex items-center justify-between">
//                       <p className="text-sm font-semibold text-gray-800">Variant {vIndex + 1}</p>
//                       {formState.variants.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeVariant(vIndex)}
//                           className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
//                         >
//                           <X className="h-4 w-4" /> Remove
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                       <div className="col-span-2 md:col-span-2">
//                         <Label>
//                           SKU
//                           <Req />
//                         </Label>
//                         <Input name="sku" value={variant.sku} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                       </div>
//                       <div className="col-span-2 md:col-span-2">
//                         <Label>
//                           Stock
//                           <Req />
//                         </Label>
//                         <Input name="stock" type="number" value={variant.stock} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                       </div>
//                       <div>
//                         <Label>
//                           Price (₹)
//                           <Req />
//                         </Label>
//                         <Input name="price" type="number" value={variant.price} onChange={(e) => handleChange(e, { variantIndex: vIndex })} />
//                       </div>
//                       <div>
//                         <Label>Selling price (₹)</Label>
//                         <Input
//                           name="sellingPrice"
//                           type="number"
//                           value={variant.sellingPrice || 0}
//                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                         />
//                       </div>
//                       <div>
//                         <Label>Discount %</Label>
//                         <Input
//                           type="number"
//                           value={
//                             variant.price && variant.sellingPrice
//                               ? Math.round(((variant.price - variant.sellingPrice) / variant.price) * 100)
//                               : 0
//                           }
//                           {...({ readOnly: true } as any)}
//                           className="cursor-not-allowed bg-gray-100"
//                         />
//                       </div>
//                     </div>

//                     <div className="mt-5 border-t border-gray-200 pt-4">
//                       <p className="mb-3 text-sm font-medium text-gray-700">Attributes</p>
//                       <div className="space-y-3">
//                         {variant.attributes.map((attr, aIndex) => (
//                           <div key={aIndex} className="flex items-end gap-3">
//                             <div className="flex-1">
//                               <Label>Name</Label>
//                               <Input
//                                 value={attr.key}
//                                 placeholder="e.g. Colour"
//                                 onChange={(e) =>
//                                   handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "key" })
//                                 }
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <Label>Value</Label>
//                               <Input
//                                 value={attr.value}
//                                 placeholder="e.g. Red"
//                                 onChange={(e) =>
//                                   handleChange(e, { variantIndex: vIndex, attrIndex: aIndex, attrField: "value" })
//                                 }
//                               />
//                             </div>
//                             {variant.attributes.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeAttribute(vIndex, aIndex)}
//                                 className="mb-1 flex h-9 w-9 items-center justify-center rounded-[10px] text-gray-500 hover:bg-gray-100 hover:text-red-600"
//                                 aria-label="Remove attribute"
//                               >
//                                 <X className="h-4 w-4" />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => addAttribute(vIndex)}
//                         className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
//                       >
//                         <Plus className="h-4 w-4" /> Add attribute
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   onClick={addVariant}
//                   className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 text-sm font-medium text-gray-600 hover:border-blue-600 hover:text-blue-600"
//                 >
//                   <Plus className="h-4 w-4" /> Add another variant
//                 </button>
//               </div>
//             )}
//           </Card>

//           {/* Shipping */}
//           <Card title="Shipping" description="Package size, weight and delivery options" icon={Truck}>
//             <div className="space-y-5">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <div>
//                   <Label>
//                     Length (cm)
//                     <Req />
//                   </Label>
//                   <Input type="text" name="length" placeholder="0" value={d.length || ""} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>
//                     Width (cm)
//                     <Req />
//                   </Label>
//                   <Input type="text" name="width" placeholder="0" value={d.width || ""} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>
//                     Height (cm)
//                     <Req />
//                   </Label>
//                   <Input type="text" name="height" placeholder="0" value={d.height || ""} onChange={handleChange} />
//                 </div>
//               </div>

//               <div className="max-w-xs">
//                 <Label>
//                   Weight
//                   <Req />
//                 </Label>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     name="weight"
//                     placeholder="0"
//                     value={d.weight || ""}
//                     onChange={handleChange}
//                     className="w-full"
//                     min="0"
//                   />
//                   <select name="weightUnit" value={d.weightUnit || "kg"} onChange={handleChange} className={`${selectClass} !w-20`}>
//                     <option value="kg">kg</option>
//                     <option value="g">g</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                 <ToggleRow
//                   title="Shipping available"
//                   hint="Allow this product to be delivered"
//                   checked={d.shippingAvailable ?? false}
//                   onChange={(v) => setField("shippingAvailable", v)}
//                 />
//                 <ToggleRow
//                   title="Cash on delivery"
//                   hint="Let customers pay on delivery"
//                   checked={d.codAvailable ?? false}
//                   onChange={(v) => setField("codAvailable", v)}
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Policies */}
//           <Card title="Policies" description="Returns, replacement, cancellation and warranty" icon={ShieldCheck}>
//             <div className="space-y-5">
//               <ReturnReplacementPolicyFields
//                 value={policyFromForm(d)}
//                 errors={policyErrors}
//                 onChange={(patch) => {
//                   setFormState((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
//                   setPolicyErrors((prev) => {
//                     const next = { ...prev };
//                     (Object.keys(patch) as (keyof ReturnReplacementPolicy)[]).forEach((k) => delete next[k]);
//                     return next;
//                   });
//                 }}
//               />

//               <ToggleRow
//                 title="Customer can cancel before dispatch"
//                 hint="When off, customers can't cancel orders with this product. Staff can still cancel with a reason."
//                 checked={d.cancelable !== false}
//                 onChange={(v) => setField("cancelable", v)}
//               />

//               <div>
//                 <Label>Warranty info</Label>
//                 <TextArea
//                   name="warrantyInfo"
//                   placeholder="e.g. 1-year manufacturer warranty"
//                   value={d.warrantyInfo || ""}
//                   onChange={handleChange}
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* ============ SIDEBAR ============ */}
//         <aside className="space-y-6 lg:col-span-1">
//           {/* Status */}
//           <section className="rounded-[10px] border border-gray-200 bg-white p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-[15px] font-semibold text-gray-900">Status</h2>
//                 <p className="mt-0.5 text-xs text-gray-500">
//                   {isActive ? "Visible on the storefront" : "Hidden from the storefront"}
//                 </p>
//               </div>
//               <Switch checked={isActive} onChange={setIsActive} label="Toggle product status" />
//             </div>
//           </section>

//           {/* Organisation */}
//           <Card title="Organisation" description="Where this product is listed" icon={FolderTree}>
//             <div className="space-y-4">
//               <div>
//                 <Label>
//                   Category
//                   <Req />
//                 </Label>
//                 <select
//                   name="categoryId"
//                   value={d.categoryId || ""}
//                   onChange={handleCategoryChange}
//                   className={selectClass}
//                   required
//                 >
//                   <option value="">Select category</option>
//                   {options.categories.map((cat) => (
//                     <option key={cat.value} value={cat.value}>
//                       {cat.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {filteredSubCategory.length > 0 && (
//                 <div>
//                   <Label>Subcategory</Label>
//                   <select
//                     name="subCategoryId"
//                     value={d.subCategoryId || ""}
//                     onChange={(e) => handleSubCategoryChange(e.target.value)}
//                     className={selectClass}
//                   >
//                     <option value="">Select subcategory</option>
//                     {filteredSubCategory.map((sub) => (
//                       <option key={sub.value} value={sub.value}>
//                         {sub.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               {options.subCategoryChildren.length > 0 && (
//                 <div>
//                   <Label>Child category</Label>
//                   <select
//                     name="childSubCategoryId"
//                     value={d.childSubCategoryId || ""}
//                     onChange={handleChange}
//                     className={selectClass}
//                   >
//                     <option value="">Select child category</option>
//                     {options.subCategoryChildren.map((child) => (
//                       <option key={child.value} value={child.value}>
//                         {child.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Keywords */}
//           <Card title="Search keywords" description="Help customers find this product" icon={Tag}>
//             <ChipInput
//               value={d.keywords || []}
//               onChange={(keywords) => setFormState((prev) => ({ ...prev, data: { ...prev.data, keywords } }))}
//               placeholder="Type a keyword and press Enter"
//             />
//           </Card>

//           {/* Linked products */}
//           <Card
//             title="Linked products"
//             description="Show other products as options (e.g. other colours)"
//             icon={Link2}
//           >
//             <div className="relative">
//               <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by SKU…"
//                 value={skuSearch}
//                 onChange={(e) => handleSkuSearch(e.target.value)}
//                 className="!pl-9"
//               />
//               {searchResults.length > 0 && (
//                 <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-[10px] border border-gray-200 bg-white">
//                   {searchResults.map((p) => (
//                     <button
//                       type="button"
//                       key={p.id}
//                       onClick={() => handleAddVariant(p)}
//                       className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-100"
//                     >
//                       <img
//                         src={p.images?.[0]?.imageUrl || "/no-image.png"}
//                         alt={p.name || "Product"}
//                         className="h-10 w-10 rounded-md object-cover"
//                       />
//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
//                         <p className="text-xs text-gray-500">{p.skuCode}</p>
//                       </div>
//                       <Plus className="h-4 w-4 text-blue-600" />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {selectedVariants.length > 0 ? (
//               <ul className="mt-4 space-y-2">
//                 {selectedVariants.map((v) => (
//                   <li key={v.id} className="flex items-center gap-3 rounded-[10px] border border-gray-200 p-2">
//                     <img
//                       src={
//                         v.images?.[0]?.large ||
//                         v.images?.[0]?.medium ||
//                         v.images?.[0]?.thumbnail ||
//                         v.images?.[0]?.imageUrl ||
//                         "/no-image.png"
//                       }
//                       alt={v.name || "Linked product"}
//                       className="h-12 w-12 rounded-md object-cover"
//                     />
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-medium text-gray-900">{v.name}</p>
//                       <p className="text-xs text-gray-500">{v.skuCode}</p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveVariant(v.id)}
//                       className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 hover:bg-gray-100 hover:text-red-600"
//                       aria-label="Remove linked product"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="mt-4 text-xs text-gray-500">No linked products yet.</p>
//             )}
//           </Card>
//         </aside>
//       </div>
//     </form>
//   );
// };

// export default EditProductPage;


"use client";
import {
  fetchProductsByGroup,
  updateProductGroup,
  fetchProductById,
  updateProductById,
} from "@/services/product/productService";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAllGstRatesAPI } from "@/components/features/gst/service/gst.api";
import { GstRate } from "@/components/features/gst/type/gst.types";
import Input from "../../../../../../components/form/input/InputField";
import Label from "../../../../../../components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import RichTextEditor from "@/components/form/input/RichTextEditor";
import ChipInput from "@/components/form/input/ChipInput";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedProduct, setProducts } from "@/redux/productSlice";
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { Variant } from "@/components/types/product";
import { apiConnector } from "@/services/apiConnector";
import { calculateOfferPercentage } from "@/utils/priceUtils";
import ReturnReplacementPolicyFields from "@/components/products/ReturnReplacementPolicyFields";
import {
  PolicyErrors,
  ReturnReplacementPolicy,
  policyFromProduct,
  policyToPayload,
  validateReturnPolicy,
} from "@/validations/returnPolicy";
import {
  ArrowLeft,
  X,
  Plus,
  Upload,
  Search,
  Package,
  IndianRupee,
  Truck,
  Layers,
  ImageIcon,
  FileText,
  ShieldCheck,
  Tag,
  FolderTree,
  Link2,
  Loader2,
  Check,
} from "lucide-react";

type ProductImageType = {
  id: number;
  imageUrl: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
};
type SubCategoryOption = { value: string; label: string; categoryId: string };
type ProductLite = {
  id: number;
  name: string;
  skuCode: string;
  variantGroupId?: number;
  images?: ProductImageType[];
};

// ---------- Utils ----------
const safeNum = (v: any, fallback = 0): number => {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

const computeSellingPrice = (price: number, offer: number): number => {
  const priceNum = safeNum(price, 0);
  const offerNum = safeNum(offer, 0);
  return Math.round((priceNum * (1 - offerNum / 100) + Number.EPSILON) * 100) / 100;
};

const policyFromForm = (data: any): ReturnReplacementPolicy => ({
  returnEligible: data?.returnEligible === true,
  returnWindowDays: Number(data?.returnWindowDays) || 0,
  replacementEligible: data?.replacementEligible === true,
  replacementWindowDays: Number(data?.replacementWindowDays) || 0,
  returnPolicyConditions: data?.returnPolicyConditions ?? "",
});

// ---------- UI Primitives ----------
const selectClass =
  "w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-2xs outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50 dark:bg-gray-800 dark:text-white dark:border-gray-700";

const Card = ({
  id,
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white shadow-2xs"
  >
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {action}
    </header>
    <div className="p-6">{children}</div>
  </section>
);

const Req = () => <span className="text-rose-500"> *</span>;

const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-600/30 ${
      checked ? "bg-emerald-600" : "bg-slate-200"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

const ToggleRow = ({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 transition hover:border-slate-300">
    <div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
    </div>
    <Switch checked={checked} onChange={onChange} label={title} />
  </div>
);

const imgSrc = (img: any) =>
  typeof img === "string"
    ? img
    : img?.imageUrl || img?.large || img?.medium || img?.thumbnail || "/no-image.png";

// ---------- Page ----------
const EditProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const [policyErrors, setPolicyErrors] = useState<PolicyErrors>({});
  const { id } = useParams();
  const router = useRouter();

  const { selectedProduct, products } = useSelector((state: RootState) => state.product);

  const [formState, setFormState] = useState({
    data: null as any,
    variants: [] as Variant[],
    images: [] as ProductImageType[],
    newImages: [] as File[],
    removedImageIds: [] as number[],
    loading: false,
    initialized: false,
  });
  const [options, setOptions] = useState({
    categories: [] as { value: string; label: string }[],
    subCategories: [] as SubCategoryOption[],
    subCategoryChildren: [] as { value: string; label: string }[],
    loading: true,
  });
  const [skuSearch, setSkuSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ProductLite[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<ProductLite[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [filteredSubCategory, setFilteredSubCategory] = useState<{ value: string; label: string }[]>([]);
  const [gstRateOptions, setGstRateOptions] = useState<GstRate[]>([]);
  const [gstFetchError, setGstFetchError] = useState("");

  // Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const res = await fetchProductById(Number(id));
        dispatch(setSelectedProduct(res.product));
        setIsActive(res.product.isActive ?? true);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
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
    if (selectedVariants.some((v) => v.id === product.id)) {
      toast.warning("Already added");
      return;
    }
    setSelectedVariants((prev) => [...prev, product]);
    setSearchResults([]);
    setSkuSearch("");
  };

  const handleRemoveVariant = (pid: number) => {
    setSelectedVariants((prev) => prev.filter((p) => p.id !== pid));
  };

  // Fetch categories, subcategories, GST
  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        setOptions((prev) => ({ ...prev, loading: true }));

        const categoriesRes = await apiConnector("GET", "/category");
        const subCategoriesRes = await fetchSubCategoryAll();
        const [gstRes] = await Promise.all([getAllGstRatesAPI()]);

        const gstList = gstRes.data?.data;
        setGstRateOptions(Array.isArray(gstList) ? gstList.filter((item: GstRate) => item.isActive) : []);
        setGstFetchError("");

        const categories = Array.isArray(categoriesRes.data?.categories)
          ? categoriesRes.data.categories
          : [];

        setOptions((prev) => ({
          ...prev,
          categories: categories.map((cat: any) => ({ value: String(cat.id), label: cat.name })),
          subCategories: subCategoriesRes.map((cat: any) => ({
            value: String(cat.id),
            label: cat.name,
            categoryId: String(cat.category?.id || ""),
          })),
          loading: false,
        }));
      } catch (err) {
        console.error("Options fetch error", err);
        toast.error("Failed to load categories and subcategories");
        setOptions((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchOptionsData();
  }, []);

  // Load grouped (linked) products
  useEffect(() => {
    const loadGroupProducts = async () => {
      if (!selectedProduct?.variantGroupId) {
        setSelectedVariants([]);
        return;
      }
      try {
        const list = await fetchProductsByGroup(selectedProduct.variantGroupId);
        setSelectedVariants(list.filter((p: any) => p.id !== selectedProduct.id));
      } catch (err) {
        console.error("Group load error", err);
      }
    };
    loadGroupProducts();
  }, [selectedProduct]);

  // Initialise form
  useEffect(() => {
    if (!selectedProduct) return;
    if (formState.initialized) return;

    try {
      const initialVariants: Variant[] = (selectedProduct.variants || []).map((v: any) => {
        const price = safeNum(v.price, 0);
        const offer = safeNum(v.offer, 0);
        const sellingPrice = safeNum(v.sellingPrice, computeSellingPrice(price, offer));
        return {
          id: v.id,
          sku: v.sku ?? "",
          price,
          sellingPrice,
          stock: safeNum(v.stock, 0),
          offer,
          attributes:
            (v.attributes || []).length > 0
              ? v.attributes.map((a: any) => ({ key: a.key ?? "", value: a.value ?? "" }))
              : [{ key: "", value: "" }],
        };
      });

      let filtered: any[] = [];
      const categoryId = selectedProduct.category?.id;
      if (categoryId) {
        filtered = options.subCategories.filter((sc: any) => sc.categoryId === String(categoryId));
      }
      setFilteredSubCategory(filtered);

      if (selectedProduct.subCategory?.id) {
        fetchChildren(String(selectedProduct.subCategory.id));
      }

      setFormState({
        data: {
          ...selectedProduct,
          // hsnCode: String(selectedProduct.hsnCode ?? selectedProduct.hsn?.code ?? selectedProduct.hsn?.hsnCode ?? ""),
          hsnCode: String(
  selectedProduct.hsnCode ??
  selectedProduct.hsn?.hsnCode ??
  ""
),
          gstRateId: String(selectedProduct.gstRate?.id ?? selectedProduct.gstRateId ?? ""),
          dimensionUnit: selectedProduct.dimensionUnit ?? "cm",
          description: selectedProduct.description ?? "",
          categoryId: selectedProduct.category ? String(selectedProduct.category.id) : "",
          subCategoryId: selectedProduct.subCategory ? String(selectedProduct.subCategory.id) : "",
          childSubCategoryId: selectedProduct.childSubCategory?.id
            ? String(selectedProduct.childSubCategory.id)
            : "",
          originalPrice: safeNum(selectedProduct.originalPrice, 0),
          finalPrice: safeNum(selectedProduct.price, 0),
          ...policyFromProduct(selectedProduct),
          cancelable: selectedProduct.cancelable ?? true,
          warrantyInfo: selectedProduct.warrantyInfo ?? "",
        },
        variants: initialVariants,
        images: selectedProduct.images || [],
        newImages: [],
        removedImageIds: [],
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error("Error initializing form data:", error);
    }
  }, [selectedProduct, formState.initialized]);

  useEffect(() => {
    if (formState.data?.categoryId && options.subCategories.length > 0) {
      setFilteredSubCategory(
        options.subCategories.filter((sc) => sc.categoryId === String(formState.data.categoryId))
      );
    }
  }, [formState.data?.categoryId, options.subCategories]);

  const fetchChildren = async (parentId: string) => {
    try {
      const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
      const children = Array.isArray(res.data.children) ? res.data.children : res.data;
      setOptions((prev) => ({
        ...prev,
        subCategoryChildren: children.map((item: any) => ({
          value: String(item.id),
          label: item.name,
          parentId: String(parentId),
        })),
      }));
    } catch (error) {
      console.error("Failed to fetch subcategory children:", error);
      setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilteredSubCategory(options.subCategories.filter((sc) => sc.categoryId === value));
    setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, categoryId: value, subCategoryId: "", childSubCategoryId: "" },
    }));
  };

  const handleSubCategoryChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, subCategoryId: value, childSubCategoryId: "" },
    }));
    if (value) fetchChildren(value);
    else setOptions((prev) => ({ ...prev, subCategoryChildren: [] }));
  };

  // Generic change handler (form fields + variant fields)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    opts?: { variantIndex?: number; attrIndex?: number; attrField?: "key" | "value" }
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (opts?.variantIndex !== undefined) {
      const { variantIndex, attrIndex, attrField } = opts;

      setFormState((prev) => {
        const updatedVariants = [...prev.variants];

        if (attrIndex !== undefined && attrField && updatedVariants[variantIndex]?.attributes[attrIndex]) {
          updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
        } else if (name !== "attributes") {
          (updatedVariants[variantIndex] as any)[name] = value;

          if (name === "price" || name === "sellingPrice") {
            const price = name === "price" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].price, 0);
            let sellingPrice =
              name === "sellingPrice" ? safeNum(value, 0) : safeNum(updatedVariants[variantIndex].sellingPrice, 0);

            if (sellingPrice < 0) sellingPrice = 0;
            if (sellingPrice > price) sellingPrice = price;

            updatedVariants[variantIndex].sellingPrice = sellingPrice;
            updatedVariants[variantIndex].offer =
              price > 0 ? Math.round(((price - sellingPrice) / price) * 100) : 0;
          }
        }
        return { ...prev, variants: updatedVariants };
      });
      return;
    }

    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: type === "checkbox" ? checked : value },
    }));
  };

  const setField = (name: string, value: any) =>
    setFormState((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));

  // Variants
  const addVariant = () => {
    setFormState((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { sku: "", price: 0, sellingPrice: 0, stock: 0, offer: 0, attributes: [{ key: "", value: "" }] },
      ],
    }));
  };

  const toggleVariants = () => {
    setShowVariants((prev) => !prev);
    if (!showVariants && formState.variants.length === 0) addVariant();
  };

  const removeVariant = (index: number) => {
    setFormState((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const addAttribute = (vIndex: number) => {
    setFormState((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[vIndex].attributes.push({ key: "", value: "" });
      return { ...prev, variants: updatedVariants };
    });
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    setFormState((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes = updatedVariants[variantIndex].attributes.filter(
        (_, i) => i !== attrIndex
      );
      return { ...prev, variants: updatedVariants };
    });
  };

  // Images
  const handleRemoveImage = (index: number) => {
    setFormState((prev) => {
      const imageToRemove = prev.images[index];
      if (!imageToRemove) return prev;
      return {
        ...prev,
        removedImageIds: imageToRemove.id ? [...prev.removedImageIds, imageToRemove.id] : prev.removedImageIds,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
  };

  const handleRemoveNewImage = (index: number) => {
    setFormState((prev) => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const totalImages = filesArray.length + formState.newImages.length + formState.images.length;

    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const validFiles = filesArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setFormState((prev) => ({ ...prev, newImages: [...prev.newImages, ...validFiles] }));
    e.target.value = "";
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.data) {
      toast.error("Form data not initialized");
      return;
    }
    if (!formState.data.name?.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formState.data.categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!String(formState.data.hsnCode ?? "").trim()) {
      toast.error("HSN code is required");
      return;
    }
    if (!formState.data.gstRateId) {
      toast.error("GST rate is required");
      return;
    }
    if (!showVariants && formState.data.originalPrice <= 0) {
      toast.error("Original price must be greater than 0");
      return;
    }
    if (showVariants) {
      const invalidVariant = formState.variants.find((v) => !v.sku?.trim() || v.price <= 0 || v.stock < 0);
      if (invalidVariant) {
        toast.error("All variants must have SKU, valid price, and stock");
        return;
      }
    }
    const policy = policyFromForm(formState.data);
    const policyIssues = validateReturnPolicy(policy);
    setPolicyErrors(policyIssues);
    if (Object.keys(policyIssues).length > 0) {
      toast.error(Object.values(policyIssues)[0] as string);
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      const sanitizedVariants = formState.variants
        .filter((v) => v.sku || v.price || v.stock)
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
            .filter((a) => a.key?.trim() && a.value?.trim())
            .map((a) => ({ key: a.key?.trim() ?? "", value: a.value?.trim() ?? "" })),
        }));

      const hasVariants = showVariants && sanitizedVariants.length > 0;
      const productData = new FormData();

      productData.append("name", formState.data.name?.trim() || "");
      productData.append("description", formState.data.description?.trim() || "");
      productData.append("slug", formState.data.slug?.trim() || "");
      productData.append("categoryId", String(formState.data.categoryId ?? 0));
      if (formState.data.subCategoryId) productData.append("subCategoryId", formState.data.subCategoryId);
      productData.append("childSubCategoryId", String(formState.data.childSubCategoryId || ""));
      productData.append("originalPrice", String(formState.data.originalPrice || 0));
      productData.append("finalPrice", String(formState.data.finalPrice || 0));
      productData.append("hsnCode", String(formState.data.hsnCode ?? "").trim());
      productData.append("gstRateId", String(formState.data.gstRateId));
      productData.append("price", String(hasVariants ? 0 : formState.data.finalPrice || 0));
      productData.append("material", formState.data.material?.trim() || "");
      productData.append("stock", String(hasVariants ? 0 : formState.data.stock ?? 0));
      productData.append("length", String(formState.data.length ?? 0));
      productData.append("height", String(formState.data.height ?? 0));
      productData.append("width", String(formState.data.width ?? 0));
      productData.append("weight", String(formState.data.weight ?? 0));
      productData.append("weightUnit", formState.data.weightUnit?.trim() || "kg");
      productData.append("dimensionUnit", formState.data.dimensionUnit || "cm");
      productData.append("shippingAvailable", String(formState.data.shippingAvailable ?? false));
      productData.append("codAvailable", String(formState.data.codAvailable ?? false));
      productData.append("skuCode", formState.data.skuCode?.trim() || "");

      Object.entries(policyToPayload(policy)).forEach(([key, value]) => productData.append(key, value));

      productData.append("cancelable", String(formState.data.cancelable ?? true));
      productData.append("warrantyInfo", formState.data.warrantyInfo?.trim() || "");
      productData.append("manufactureDetails", formState.data.manufactureDetails?.trim() || "");
      productData.append("hasVariants", String(hasVariants));
      productData.append("isActive", String(isActive));
      productData.append("keywords", JSON.stringify(formState.data.keywords || []));

      if (hasVariants) productData.append("variants", JSON.stringify(sanitizedVariants));

      if (formState.removedImageIds.length > 0) {
        productData.append("removeImagePublicIds", JSON.stringify(formState.removedImageIds));
      }
      formState.newImages.forEach((file) => productData.append("images", file));

      const updatedProduct = await updateProductById(formState.data.id, productData);

      if (selectedVariants.length > 0) {
        await updateProductGroup(formState.data.id, selectedVariants.map((v) => v.id));
      }

      const updatedList = products.map((p) => (p.id === formState.data.id ? updatedProduct : p));
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(updatedProduct));

      toast.success("Product updated successfully");
      router.push("/product");
      setFormState((prev) => ({ ...prev, newImages: [], removedImageIds: [], loading: false }));
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed");
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Skeleton Loading State
  if (!formState.data || options.loading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-pulse space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded-md bg-slate-200" />
              <div className="h-3 w-28 rounded-md bg-slate-200" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 rounded-xl bg-slate-200" />
            <div className="h-10 w-32 rounded-xl bg-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 rounded-2xl bg-slate-200" />
            <div className="h-52 rounded-2xl bg-slate-200" />
            <div className="h-60 rounded-2xl bg-slate-200" />
          </div>
          <div className="space-y-6">
            <div className="h-24 rounded-2xl bg-slate-200" />
            <div className="h-56 rounded-2xl bg-slate-200" />
            <div className="h-44 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  const d = formState.data;
  const totalImages = formState.images.length + formState.newImages.length;

  const sectionLinks = [
    { href: "#basic-info", label: "General" },
    { href: "#media-section", label: "Media" },
    { href: "#pricing-section", label: "Pricing & Tax" },
    ...(showVariants ? [{ href: "#variants-section", label: "Variants" }] : [{ href: "#inventory-section", label: "Inventory" }]),
    { href: "#shipping-section", label: "Shipping" },
    { href: "#policies-section", label: "Policies" },
  ];

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-slate-50/70 pb-16 text-slate-900">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  {d.name || "Edit product"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-slate-100 text-slate-600 ring-slate-500/15"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {isActive ? "Active" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                SKU: <span className="font-mono font-medium text-slate-700">{d.skuCode || "—"}</span>
                {d.id ? ` · ID #${d.id}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={formState.loading}
              className="h-9 rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={formState.loading}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm"
            >
              {formState.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {formState.loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* Quick Section Jump Bar */}
        <div className="border-t border-slate-100 bg-slate-50/70">
          <nav
            aria-label="Form sections"
            className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6"
          >
            {sectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-2xs"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* ============ MAIN COLUMN (8 cols) ============ */}
          <div className="space-y-6 lg:col-span-8">
            {/* Basic info */}
            <Card
              id="basic-info"
              title="Basic information"
              description="Product title, SKU, material and storefront description"
              icon={FileText}
            >
              <div className="space-y-4">
                <div>
                  <Label>
                    Product name
                    <Req />
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="e.g. Premium Cotton Bath Towel"
                    value={d.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>
                      SKU code
                      <Req />
                    </Label>
                    <Input
                      type="text"
                      name="skuCode"
                      placeholder="e.g. SKU-TWL-001"
                      value={d.skuCode || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>
                      Material
                      <Req />
                    </Label>
                    <Input
                      type="text"
                      name="material"
                      placeholder="e.g. 100% Combed Cotton"
                      value={d.material || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <div className="mt-1 overflow-hidden rounded-xl border border-slate-200">
                    <RichTextEditor
                      value={d.description || ""}
                      onChange={(value) => setField("description", value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Media */}
            <Card
              id="media-section"
              title="Media gallery"
              description={`${totalImages} of 10 images used · First image is primary · Max 5MB per file`}
              icon={ImageIcon}
            >
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
                {formState.images.map((img, index) => (
                  <div
                    key={`existing-${img.id ?? index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-2xs"
                  >
                    <img
                      src={imgSrc(img)}
                      alt={`product-${index}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-md bg-slate-900/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-xs">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-sm opacity-0 transition hover:bg-rose-50 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {formState.newImages.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-emerald-400 bg-slate-50 shadow-2xs"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-sm opacity-0 transition hover:bg-rose-50 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {totalImages < 10 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-slate-500 transition hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-2xs ring-1 ring-slate-200">
                      <Upload className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold">Upload</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
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
            </Card>

            {/* Pricing & tax */}
            <Card
              id="pricing-section"
              title="Pricing & tax"
              description={
                showVariants
                  ? "Individual pricing is managed inside each variant below"
                  : "MRP, selling price, discount calculation and GST configuration"
              }
              icon={IndianRupee}
            >
              <div className="space-y-5">
                {!showVariants && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label>
                        Original price (₹)
                        <Req />
                      </Label>
                      <Input
                        name="originalPrice"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={d.originalPrice || 0}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>
                        Selling price (₹)
                        <Req />
                      </Label>
                      <Input
                        name="finalPrice"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={d.finalPrice || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Discount</Label>
                      <div className="flex h-10 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-emerald-700">
                        <span>
                          {calculateOfferPercentage(
                            Number(d.originalPrice),
                            Number(d.finalPrice)
                          )}
                          % OFF
                        </span>
                        <span className="text-[11px] font-normal text-slate-400">Auto</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tax information (GST) */}
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      GST & Tax Classification
                    </h3>
                  </div>

                  {gstFetchError && (
                    <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                      {gstFetchError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>
                        HSN code
                        <Req />
                      </Label>
                      <Input
                        name="hsnCode"
                        type="text"
                        placeholder="e.g. 6302"
                        value={d.hsnCode ?? ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>
                        GST rate
                        <Req />
                      </Label>
                      <select
                        name="gstRateId"
                        value={d.gstRateId || ""}
                        onChange={handleChange}
                        className={selectClass}
                        required
                      >
                        <option value="">Select GST rate</option>
                        {gstRateOptions.map((gst) => (
                          <option key={gst.id} value={String(gst.id)}>
                            {gst.rateName} ({gst.totalRate}%)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const selectedRate = gstRateOptions.find(
                      (g) => String(g.id) === String(d.gstRateId)
                    );
                    if (!selectedRate) return null;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Tax Slab Breakdown · {selectedRate.rateName}
                          </h4>
                          <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                            Tax Inclusive
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            ["Total GST", selectedRate.totalRate],
                            ["CGST", selectedRate.cgstRate],
                            ["SGST", selectedRate.sgstRate],
                            ["IGST", selectedRate.igstRate],
                          ].map(([label, val]) => (
                            <div
                              key={label as string}
                              className="rounded-lg border border-slate-200/80 bg-white px-3 py-2"
                            >
                              <p className="text-[11px] text-slate-500">{label}</p>
                              <p className="mt-0.5 text-sm font-bold text-slate-900">
                                {val}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Card>

            {/* Inventory */}
            {!showVariants && (
              <Card
                id="inventory-section"
                title="Inventory"
                description="Available stock levels and pack configuration"
                icon={Package}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>
                      Stock quantity
                      <Req />
                    </Label>
                    <Input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={d.stock || 0}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Pack quantity (optional)</Label>
                    <Input
                      type="number"
                      min="1"
                      name="packQuantity"
                      placeholder="e.g. 1"
                      value={d.packQuantity || 0}
                      onChange={handleChange}
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      Units bundled inside a single sold pack.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Variants */}
            <Card
              id="variants-section"
              title="Variants"
              description="Manage SKUs, pricing, stock and attributes per variant"
              icon={Layers}
              action={
                <button
                  type="button"
                  onClick={toggleVariants}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-semibold transition ${
                    showVariants
                      ? "border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-50"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {showVariants ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {showVariants ? "Disable variants" : "Add variants"}
                </button>
              }
            >
              {!showVariants ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    Single-product mode active
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Enable variants if this product comes in multiple sizes, colors, or capacities.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formState.variants.map((variant, vIndex) => (
                    <div
                      key={variant.id ?? vIndex}
                      className="rounded-xl border border-slate-200 bg-slate-50/40 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-slate-200/70 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white">
                            {vIndex + 1}
                          </span>
                          <p className="text-sm font-semibold text-slate-900">
                            {variant.sku ? variant.sku : `Variant #${vIndex + 1}`}
                          </p>
                        </div>
                        {formState.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(vIndex)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            <X className="h-3.5 w-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                          <Label>
                            SKU
                            <Req />
                          </Label>
                          <Input
                            name="sku"
                            value={variant.sku}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                        <div>
                          <Label>
                            Stock
                            <Req />
                          </Label>
                          <Input
                            name="stock"
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                        <div>
                          <Label>
                            MRP / Price (₹)
                            <Req />
                          </Label>
                          <Input
                            name="price"
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                        <div>
                          <Label>Selling price (₹)</Label>
                          <Input
                            name="sellingPrice"
                            type="number"
                            value={variant.sellingPrice || 0}
                            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          />
                        </div>
                        <div>
                          <Label>Discount</Label>
                          <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-emerald-700">
                            {variant.price && variant.sellingPrice
                              ? `${Math.round(
                                  ((variant.price - variant.sellingPrice) / variant.price) * 100
                                )}% OFF`
                              : "0% OFF"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-slate-200/70 pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Variant Attributes
                        </p>
                        <div className="space-y-2.5">
                          {variant.attributes.map((attr, aIndex) => (
                            <div key={aIndex} className="flex items-end gap-2.5">
                              <div className="flex-1">
                                <Label>Attribute</Label>
                                <Input
                                  value={attr.key}
                                  placeholder="e.g. Color"
                                  onChange={(e) =>
                                    handleChange(e, {
                                      variantIndex: vIndex,
                                      attrIndex: aIndex,
                                      attrField: "key",
                                    })
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <Label>Value</Label>
                                <Input
                                  value={attr.value}
                                  placeholder="e.g. Navy Blue"
                                  onChange={(e) =>
                                    handleChange(e, {
                                      variantIndex: vIndex,
                                      attrIndex: aIndex,
                                      attrField: "value",
                                    })
                                  }
                                />
                              </div>
                              {variant.attributes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeAttribute(vIndex, aIndex)}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                  aria-label="Remove attribute"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addAttribute(vIndex)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add attribute
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-50 sm:text-sm"
                  >
                    <Plus className="h-4 w-4" /> Add another variant
                  </button>
                </div>
              )}
            </Card>

            {/* Shipping */}
            <Card
              id="shipping-section"
              title="Shipping & fulfillment"
              description="Package dimensions, weight and delivery payment rules"
              icon={Truck}
            >
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label>
                      Length (cm)
                      <Req />
                    </Label>
                    <Input
                      type="text"
                      name="length"
                      placeholder="0"
                      value={d.length || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>
                      Width (cm)
                      <Req />
                    </Label>
                    <Input
                      type="text"
                      name="width"
                      placeholder="0"
                      value={d.width || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>
                      Height (cm)
                      <Req />
                    </Label>
                    <Input
                      type="text"
                      name="height"
                      placeholder="0"
                      value={d.height || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="max-w-xs">
                  <Label>
                    Package weight
                    <Req />
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="weight"
                      placeholder="0"
                      value={d.weight || ""}
                      onChange={handleChange}
                      className="w-full"
                      min="0"
                    />
                    <select
                      name="weightUnit"
                      value={d.weightUnit || "kg"}
                      onChange={handleChange}
                      className={`${selectClass} !w-20`}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <ToggleRow
                    title="Shipping available"
                    hint="Enable courier delivery for this item"
                    checked={d.shippingAvailable ?? false}
                    onChange={(v) => setField("shippingAvailable", v)}
                  />
                  <ToggleRow
                    title="Cash on delivery (COD)"
                    hint="Allow pay-on-delivery at doorstep"
                    checked={d.codAvailable ?? false}
                    onChange={(v) => setField("codAvailable", v)}
                  />
                </div>
              </div>
            </Card>

            {/* Policies */}
            <Card
              id="policies-section"
              title="Policies & warranty"
              description="Return window, replacement rules, order cancellation and warranty"
              icon={ShieldCheck}
            >
              <div className="space-y-5">
                <ReturnReplacementPolicyFields
                  value={policyFromForm(d)}
                  errors={policyErrors}
                  onChange={(patch) => {
                    setFormState((prev) => ({ ...prev, data: { ...prev.data, ...patch } }));
                    setPolicyErrors((prev) => {
                      const next = { ...prev };
                      (Object.keys(patch) as (keyof ReturnReplacementPolicy)[]).forEach(
                        (k) => delete next[k]
                      );
                      return next;
                    });
                  }}
                />

                <ToggleRow
                  title="Customer can cancel before dispatch"
                  hint="When disabled, customers cannot self-cancel orders containing this product."
                  checked={d.cancelable !== false}
                  onChange={(v) => setField("cancelable", v)}
                />

                <div>
                  <Label>Warranty details</Label>
                  <TextArea
                    name="warrantyInfo"
                    placeholder="e.g. 1-year manufacturer warranty covering stitching and hardware"
                    value={d.warrantyInfo || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* ============ SIDEBAR (4 cols) ============ */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">
            {/* Status */}
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Storefront Visibility
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isActive
                      ? "Live and purchasable on store"
                      : "Hidden from customers"}
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onChange={setIsActive}
                  label="Toggle product status"
                />
              </div>
            </section>

            {/* Organisation */}
            <Card
              title="Organisation"
              description="Category hierarchy for catalog filtering"
              icon={FolderTree}
            >
              <div className="space-y-4">
                <div>
                  <Label>
                    Category
                    <Req />
                  </Label>
                  <select
                    name="categoryId"
                    value={d.categoryId || ""}
                    onChange={handleCategoryChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select category</option>
                    {options.categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredSubCategory.length > 0 && (
                  <div>
                    <Label>Subcategory</Label>
                    <select
                      name="subCategoryId"
                      value={d.subCategoryId || ""}
                      onChange={(e) => handleSubCategoryChange(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select subcategory</option>
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
                    <Label>Child category</Label>
                    <select
                      name="childSubCategoryId"
                      value={d.childSubCategoryId || ""}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option value="">Select child category</option>
                      {options.subCategoryChildren.map((child) => (
                        <option key={child.value} value={child.value}>
                          {child.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </Card>

            {/* Keywords */}
            <Card
              title="Search keywords"
              description="Tags that improve internal search relevance"
              icon={Tag}
            >
              <ChipInput
                value={d.keywords || []}
                onChange={(keywords) =>
                  setFormState((prev) => ({ ...prev, data: { ...prev.data, keywords } }))
                }
                placeholder="Type a keyword and press Enter"
              />
            </Card>

            {/* Linked products */}
            <Card
              title="Linked products"
              description="Group related products (e.g. color swatches)"
              icon={Link2}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search product by SKU…"
                  value={skuSearch}
                  onChange={(e) => handleSkuSearch(e.target.value)}
                  className="!pl-9"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {searchResults.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleAddVariant(p)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50"
                      >
                        <img
                          src={p.images?.[0]?.imageUrl || "/no-image.png"}
                          alt={p.name || "Product"}
                          className="h-9 w-9 shrink-0 rounded-lg border border-slate-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-slate-900">
                            {p.name}
                          </p>
                          <p className="font-mono text-[11px] text-slate-500">
                            {p.skuCode}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 shrink-0 text-slate-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedVariants.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {selectedVariants.map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5"
                    >
                      <img
                        src={
                          v.images?.[0]?.large ||
                          v.images?.[0]?.medium ||
                          v.images?.[0]?.thumbnail ||
                          v.images?.[0]?.imageUrl ||
                          "/no-image.png"
                        }
                        alt={v.name || "Linked product"}
                        className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-900">
                          {v.name}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {v.skuCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove linked product"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-xs text-slate-400">
                  No linked products attached yet.
                </p>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </form>
  );
};

export default EditProductPage;