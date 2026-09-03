import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { BASE_URL, endPointSubCategory } from "../apis";

const { CREATE_SUB_CATEGORY, SUB_CATEGORY_GELL_ALL, UPDATE_SUB_CATEGORY } = endPointSubCategory;

interface CreateCategoryParams {
  formData: FormData;
  router: any;
}

//Create a Sub Category new 
export const createSubCategory  = async ({ formData, router }: CreateCategoryParams) => {
  const toastId = toast.loading("Creating Category...");

  try {
    const res = await apiConnector<any>(
      "POST",
      CREATE_SUB_CATEGORY,
      formData,
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
    const res = await apiConnector<any>(
      "PUT",
      `${UPDATE_SUB_CATEGORY}/${id}`,
      formData,
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


export const getSubCategoriesByCategory = async (
  categoryId: string | number
) => {
  const res = await apiConnector(
    "GET",
    `/subcategories/category/${categoryId}`
  );

  return res.data.subCategories;
};

export const getAllSubCategories =
  async () => {
    const res = await apiConnector(
      "GET",
      "/subcategories"
    );

    return res.data;
  };
// Fetch all child subcategories of a parent subcategory
export async function fetchChildSubCategories(parentId: number) {
  try {
    const res = await fetch(`${BASE_URL}/subcategories/${parentId}/children`);
    if (!res.ok) throw new Error("Failed to fetch child subcategories");
    const data = await res.json();
    return data.children; // ✅ the controller sends { parentId, children }
  } catch (error) {
    console.error("Error fetching child subcategories", error);
    return [];
  }
}

