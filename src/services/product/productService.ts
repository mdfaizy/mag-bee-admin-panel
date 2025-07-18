
// import { apiConnector } from "../apiConnector";
// import { endpointsProduct } from "../apis"; 
// const { PRODUCT_GELL_ALL} = endpointsProduct;

// export const fetchProductAll = async () => {
//   try {
//     // const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
//     const res = await apiConnector("GET", PRODUCT_GELL_ALL, null, {
//       // Authorization: `Bearer ${token}`,
//     });
//     return res.data;
//   } catch (err: any) {
//     console.error("API error:", err.response?.data || err.message);
//     throw err;
//   }
// };



"use client";

import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endpointsProduct } from "../apis";
import { setProducts } from "../../redux/productSlice";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type AppRouter = ReturnType<typeof useRouter>;

const { PRODUCT_CREATE, PRODUCT_GELL_ALL } = endpointsProduct;

// ---------------------- Product Interfaces ----------------------
export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  offer: number;
  quantity: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  data: Product;
}

interface ProductListResponse {
  data: Product[];
}

// ---------------------- Create Product ----------------------
interface CreateProductParams {
  formData: FormData;
  router: AppRouter;
}

export const createProduct = ({ formData, router }: CreateProductParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Product...");

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await apiConnector(
        "POST",
        PRODUCT_CREATE,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      dispatch(setProducts([res.data.data]));

      toast.success("Product created successfully!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError;
      const errMessage =
        (error.response?.data as { message?: string })?.message || error.message || "Product creation failed.";

      toast.error(errMessage);
    } finally {
      toast.dismiss(toastId);
    }
  };
};

// ---------------------- Fetch All Products ----------------------
export const fetchProductAll = async (): Promise<Product[]> => {
  try {
    const res = await apiConnector("GET", PRODUCT_GELL_ALL, null);
    return res.data.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("API error:", (error.response?.data as any)?.message || error.message);
    throw error;
  }
};
