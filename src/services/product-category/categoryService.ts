
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endpointsCategory } from "../apis";
import { setCategories } from "../../redux/productCategory";
import { AxiosError } from "axios";

const { CREATE_CATEGORY_API ,PRODUCT_CATEGORY_GET_ALL} = endpointsCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: any;
}

export const createCategory = ({ formData, router }: CreateCategoryParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Category...");

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await apiConnector<any>(
        "POST",
        CREATE_CATEGORY_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      // ✅ Update Redux store with the newly created category
      dispatch(setCategories([res.data]));
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
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  const res = await apiConnector("GET", PRODUCT_CATEGORY_GET_ALL, null, {
    Authorization: `Bearer ${token}`,
  });
  return res.data;
};




export const deleteCategory = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Deleting category...");

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

      toast.success("Category deleted successfully!");

      // Optionally refetch updated list after deletion
      const updatedList = await fetchProductCategory();
      dispatch(setCategories(updatedList));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Delete failed.";
      toast.error(errMsg);
    } finally {
      toast.dismiss(toastId);
    }
  };
};




