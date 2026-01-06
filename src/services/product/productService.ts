
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
    return res.data.products || [];
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
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
    "PATCH",
    `/products/${productId}`,
    { stock: newStock }
  );

  return res.data;
};


export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ecommerce_uploads");
  formData.append("folder", "products");
  const res = await fetch("https://api.cloudinary.com/v1_1/dditvtnis/image/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.secure_url;
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


