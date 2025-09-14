import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endPointSubCategory } from "../apis";

const { CREATE_SUB_CATEGORY ,SUB_CATEGORY_GELL_ALL} = endPointSubCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: any;
}

export const createCategory = async ({ formData, router }: CreateCategoryParams) => {
  const toastId = toast.loading("Creating Category...");

  try {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

    const res = await apiConnector<any>(
      "POST",
      CREATE_SUB_CATEGORY,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success("Product category created successfully!");
    router.push("/"); // redirect after creation
  } catch (err: any) {
    const errMessage =
      (err.response?.data as any)?.message || err.message || "Category creation failed.";

    if (errMessage === "Category already exists") {
      toast.error("Category already exists. Please use a different name.");
    } else {
      toast.error(errMessage);
    }
  } finally {
    toast.dismiss(toastId);
  }
};


export const fetchSubCategoryAll = async () => {
  try {
    const res = await apiConnector("GET", SUB_CATEGORY_GELL_ALL);
    console.log('allmproduct',res);
    return res.data;
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  
  }
};




// export const fetchSubCategories = async () => {
//   const res = await apiConnector("GET", "/subcategories");
//   return res.data;
// };

// export const deleteSubCategory = (id: number) => async (dispatch: any) => {
//   await apiConnector("DELETE", `/subcategories/${id}`);
//   const updated = await fetchSubCategories();
//   dispatch({ type: "subCategory/setSubCategories", payload: updated });
// };
