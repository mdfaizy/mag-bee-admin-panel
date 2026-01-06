// import { AppDispatch } from "@/redux/store";
// import { createProduct } from "@/services/product/productService";
// import { addProduct, setLoading, setError } from "@/redux/productSlice";
// import { toast } from "react-toastify";

// export const createProductThunk =
//   (formData: FormData, router: any) =>
//   async (dispatch: AppDispatch) => {
//     try {
//       dispatch(setLoading(true));

//       const res = await createProduct(formData);

//       // ✅ SAFE extraction (very important)
//       const product =
//         res?.data?.product ??
//         res?.data?.data ??
//         res?.data;

//       if (!product) {
//         throw new Error("Invalid product response from server");
//       }

//       dispatch(addProduct(product));
//       toast.success("Product created successfully");
//       router.push("/products");
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.message ||
//         error.message ||
//         "Product creation failed";

//       dispatch(setError(message));
//       toast.error(message);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
