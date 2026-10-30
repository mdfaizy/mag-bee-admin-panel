
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { BASE_URL, endpointsCategory } from "../apis";
import { removeCategory, setCategories } from "../../redux/productCategory";
import { AxiosError } from "axios";

const { CREATE_CATEGORY_API, PRODUCT_CATEGORY_GET_ALL } = endpointsCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: any;
}

export const createCategory = ({ formData, router }: CreateCategoryParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Category...");
    try {
      const res = await apiConnector<any>(
        "POST",
        CREATE_CATEGORY_API,
        formData,
      );
      const updatedList = await fetchProductCategory();
      dispatch(setCategories(updatedList));
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
  // const res = await apiConnector("GET", PRODUCT_CATEGORY_GET_ALL);
  // return res.data;
  try {
    const res = await apiConnector("GET", PRODUCT_CATEGORY_GET_ALL);
    // return res.data;
    return res.data.categories || [];
  } catch (error) {
    toast.error("Failed to load categories");
    return [];
  }
};

export const deleteCategory = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Deleting category...", { position: "top-center", style: { zIndex: 100 } });

    try {
      await apiConnector(
        "DELETE",
        `/category/${id}`);

      // toast.success("Category deleted successfully!", { position: "top-center" });

      // Optionally refetch updated list after deletion
      // const updatedList = await fetchProductCategory();
      // dispatch(setCategories(updatedList));
      dispatch(removeCategory(id));
      toast.success("Category deleted successfully!", { position: "top-center" });
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Delete failed.";
      toast.error(errMsg, { position: "top-center", style: { zIndex: 100 } });
    } finally {
      toast.dismiss(toastId);
    }
  };
};