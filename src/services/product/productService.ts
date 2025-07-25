
import { apiConnector } from "../apiConnector";
import { endpointsProduct } from "../apis"; 
const { PRODUCT_GELL_ALL} = endpointsProduct;

export const fetchProductAll = async () => {
  try {
    // const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    const res = await apiConnector("GET", PRODUCT_GELL_ALL, undefined, {
      // Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  }
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

export const updateProductById = async (product: any, token: string) => {
  const res = await fetch(`http://localhost:8000/api/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update product");

  return result.updatedProduct;
};


export const deleteProductById = async (id: number, token: string): Promise<string> => {
  const res = await fetch(`http://localhost:8000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to delete product");

  return result.message || "Product deleted successfully";
};


export const fetchPaginatedProducts = async (page: number, limit: number = 10) => {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";

  const res = await apiConnector(
    "GET",
    `http://localhost:8000/api/pagination-products?page=${page}&limit=${limit}`,
    {},
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return res.data; // Should be { products, total, currentPage, totalPages }
};


