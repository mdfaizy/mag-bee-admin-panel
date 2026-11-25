
import { apiConnector } from "../apiConnector";
import { BASE_URL, endpointsProduct } from "../apis"; 
const { PRODUCT_GELL_ALL,PRODUCT_BY_ID} = endpointsProduct;

export const createProduct = (formData: FormData) => {
  return apiConnector("POST", "/product", formData);
};
export const fetchProductAll = async () => {
  try {
    const res = await apiConnector("GET", PRODUCT_GELL_ALL);
    console.log('allmproduct',res);
    // return res.data;
    // return res.data.products || [];
    return Array.isArray(res.data?.products)
      ? res.data.products
      : Array.isArray(res.data?.data?.products)
      ? res.data.data.products
      : [];
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  }
};

// ======================================
// PRODUCT DRAFT API
// ======================================

// SAVE / UPDATE PRODUCT DRAFT
export const saveProductDraft = async (data: any) => {
  try {
    const res = await apiConnector("POST", "/product/draft", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to save product draft"
    );
  }
};

// GET CURRENT PRODUCT DRAFT
export const fetchCurrentProductDraft = async () => {
  try {
    const response = await apiConnector(
      "GET",
      "/product/draft/current"
    );

    return response.data ?? null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};
export const fetchProductById = async (id: number) => {
  const res = await apiConnector(
    "GET",
    `${PRODUCT_BY_ID}/${id}`);
  return res.data || res;
};

export const toggleProductStatus = async (productId: number) => {
  try {
    const res = await apiConnector(
      "PATCH",
      `/products/${productId}/toggle-active`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update product status"
    );
  }
};
export const updateProductStock = async (
  productId: number,
  newStock: number
) => {
  const res = await apiConnector(
    "PUT",
    `/products/${productId}`,
    { stock: newStock }
  );

  return res.data;
};

// services/product/productService.ts
export const updateProductById = async (
  id: number,
  formData: FormData,
) => {
  try{
     const res = await apiConnector("PUT",`/products/${id}`,formData);
    const result = res.data;
    return result;
  }catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

export const fetchProductsByGroup = async (groupId: number) => {
  try {
    const res = await apiConnector(
      "GET",
      `/product/group/${groupId}`
    );

    return res.data.products || []; // ✅ ONLY products return

  } catch (error: any) {
    console.error("❌ Error fetching group products:", error);
    throw error;
  }
};

export const updateProductGroup = async (
  mainProductId: number,
  variantIds: number[]
) => {
  try {
    const res = await apiConnector("POST", "/group", {
      mainProductId,
      variantIds,
    });

    return res.data;

  } catch (error: any) {
    console.error("❌ Error updating product group:", error);
    throw error;
  }
};
export const deleteProductById = async (id: number): Promise<string> => {
  try{
    const res = await apiConnector('DELETE',`/products/${id}`);
   return res.data.message || "Product deleted successfully";

  }catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};


export const fetchPaginatedProducts = async (page: number, limit: number = 10) => {
  const res = await apiConnector(
    "GET",
    `/pagination-products?page=${page}&limit=${limit}`);
  return res.data; 
};


