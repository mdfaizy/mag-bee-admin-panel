import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endPointSubCategory } from "../apis";

const { CREATE_SUB_CATEGORY ,SUB_CATEGORY_GELL_ALL,UPDATE_SUB_CATEGORY} = endPointSubCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: any;
}

//Create a Sub Category new 
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

//fetch all sub category
export const fetchSubCategoryAll = async () => {
  try {
    const res = await apiConnector("GET", SUB_CATEGORY_GELL_ALL);
     console.log("Raw subcategory response:", res.data);
    // Agar response object me array wrap ho, to nikaal lo
    return Array.isArray(res.data) ? res.data : res.data.subCategories || [];
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  
  }
};

interface UpdateSubCategoryParams {
  id: number | string;
  formData: FormData;
}
export const updateSubCategoryById = async ({ id, formData }: UpdateSubCategoryParams) => {
  const toastId = toast.loading("Updating SubCategory...");

  try {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

    const res = await apiConnector<any>(
      "PUT",
      `${UPDATE_SUB_CATEGORY}/${id}`,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success("SubCategory updated successfully!");
    return res.data; // updated subcategory return karega
  } catch (err: any) {
    const errMessage =
      (err.response?.data as any)?.message || err.message || "Update failed.";

    if (errMessage === "SubCategory not found") {
      toast.error("SubCategory not found.");
    } else {
      toast.error(errMessage);
    }
    throw err;
  } finally {
    toast.dismiss(toastId);
  }
};

// export const deleteSubCategory = (id: number) => async (dispatch: any) => {
//   await apiConnector("DELETE", `/subcategories/${id}`);
//   const updated = await fetchSubCategories();
//   dispatch({ type: "subCategory/setSubCategories", payload: updated });
// };
