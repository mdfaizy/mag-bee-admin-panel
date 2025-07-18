


import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endpointsCategory } from "../apis";
import { setCategories } from "../../redux/productCategory";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation"; // ✅ correct
type AppRouter = ReturnType<typeof useRouter>; // ✅ extract type from useRouter

const { CREATE_CATEGORY_API, PRODUCT_CATEGORY_GET_ALL } = endpointsCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: AppRouter ;
}

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

// If your API response is { data: { ...category } }
interface CategoryResponse {
  data: Category;
}

export const createCategory = ({ formData, router }: CreateCategoryParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Category...");

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await apiConnector<CategoryResponse>(
        "POST",
        CREATE_CATEGORY_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // ✅ If your backend sends `data` inside `res.data`
      dispatch(setCategories([res.data.data])); // 🔍 Fixed: res.data.data

      toast.success("Product category created successfully!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError;
      const errMessage =
        (error.response?.data as any)?.message || error.message || "Category creation failed.";

      if (errMessage === "Category already exists") {
        toast.error("Category already exists. Please use a different name.");
      } else {
        toast.error(errMessage);
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const fetchProductCategory = async () => {
  // const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  const res = await apiConnector("GET", PRODUCT_CATEGORY_GET_ALL, null, {
    // Authorization: `Bearer ${token}`,
  });
  return res.data;
};




export const deleteCategory = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Deleting category...", { position: "top-center" ,style: { zIndex: 100 }});

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");

      await apiConnector(
        "DELETE",
        `http://localhost:8000/api/products/category/${id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success("Category deleted successfully!", { position: "top-center" });

      // Optionally refetch updated list after deletion
      const updatedList = await fetchProductCategory();
      dispatch(setCategories(updatedList));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Delete failed.";
      toast.error(errMsg, { position: "top-center" ,style: { zIndex: 100 }});
    } finally {
      toast.dismiss(toastId);
    }
  };
};







