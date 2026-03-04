
// import { apiConnector } from "../apiConnector";
// import { BASE_URL, endpointsProduct } from "../apis"; 
// const { PRODUCT_GELL_ALL,PRODUCT_BY_ID} = endpointsProduct;

// export const createProduct = (formData: FormData) => {
//   return apiConnector("POST", "/product", formData);
// };
// export const fetchProductAll = async () => {
//   try {
//     const res = await apiConnector("GET", PRODUCT_GELL_ALL);
//     console.log('allmproduct',res);
//     // return res.data;
//     // return res.data.products || [];
//     return Array.isArray(res.data?.products)
//       ? res.data.products
//       : Array.isArray(res.data?.data?.products)
//       ? res.data.data.products
//       : [];
//   } catch (err: any) {
//     console.error("API error:", err.response?.data || err.message);
//     throw err;
//   }
// };

// export const fetchProductById = async (id: number) => {
//   const res = await apiConnector(
//     "GET",
//     `${PRODUCT_BY_ID}/${id}`);
//   return res.data || res;
// };

// export const toggleProductStatus = async (productId: number) => {
//   try {
//     const res = await apiConnector(
//       "PATCH",
//       `/products/${productId}/toggle-active`
//     );
//     return res.data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || "Failed to update product status"
//     );
//   }
// };
// export const updateProductStock = async (
//   productId: number,
//   newStock: number
// ) => {
//   const res = await apiConnector(
//     "PATCH",
//     `/products/${productId}`,
//     { stock: newStock }
//   );

//   return res.data;
// };

// // services/product/productService.ts
// export const updateProductById = async (
//   id: number,
//   formData: FormData,
// ) => {
//   try{
//      const res = await apiConnector("PUT",`/products/${id}`,formData);
//     const result = res.data;
//     return result;
//   }catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || "Failed to update product"
//     );
//   }
// };

// export const deleteProductById = async (id: number): Promise<string> => {
//   try{
//     const res = await apiConnector('DELETE',`/products/${id}`);
//    return res.data.message || "Product deleted successfully";

//   }catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || "Failed to delete product"
//     );
//   }
// };


// export const fetchPaginatedProducts = async (page: number, limit: number = 10) => {
//   const res = await apiConnector(
//     "GET",
//     `/pagination-products?page=${page}&limit=${limit}`);
//   return res.data; 
// };




import { apiConnector } from "../apiConnector";
import { endpointsProduct } from "../apis";

const {
  CREATE_PRODUCT,
  PRODUCT_GET_ALL,
  PRODUCT_BY_ID,
  PRODUCT_PAGINATION
} = endpointsProduct;


// CREATE PRODUCT
export const createProduct = async (formData: FormData) => {
  try {
    const res = await apiConnector("POST", CREATE_PRODUCT, formData);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};


// GET ALL PRODUCTS
export const fetchProductAll = async () => {
  try {
    const res = await apiConnector("GET", PRODUCT_GET_ALL);
    return res.data?.products || [];
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};


// GET PRODUCT BY ID
export const fetchProductById = async (id: number) => {
  try {
    const res = await apiConnector("GET", `${PRODUCT_BY_ID}/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product"
    );
  }
};


// UPDATE PRODUCT
export const updateProductById = async (
  id: number,
  formData: FormData
) => {
  try {
    const res = await apiConnector("PUT", `${PRODUCT_BY_ID}/${id}`, formData);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};


// DELETE PRODUCT
export const deleteProductById = async (id: number) => {
  try {
    const res = await apiConnector("DELETE", `${PRODUCT_BY_ID}/${id}`);
    return res.data?.message || "Product deleted successfully";
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};


// TOGGLE PRODUCT STATUS
export const toggleProductStatus = async (productId: number) => {
  try {
    const res = await apiConnector(
      "PATCH",
      `${PRODUCT_BY_ID}/${productId}/toggle-active`
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to update product status"
    );
  }
};


// UPDATE PRODUCT STOCK
export const updateProductStock = async (
  productId: number,
  newStock: number
) => {
  try {
    const res = await apiConnector(
      "PATCH",
      `${PRODUCT_BY_ID}/${productId}`,
      { stock: newStock }
    );

    return res.data;

  } catch (error: any) {

    throw new Error(
      error.response?.data?.message ||
        "Failed to update product stock"
    );

  }
};


// PAGINATION
export const fetchPaginatedProducts = async (
  page: number,
  limit: number = 10
) => {

  try {

    const res = await apiConnector(
      "GET",
      `${PRODUCT_PAGINATION}?page=${page}&limit=${limit}`
    );

    return res.data;

  } catch (error: any) {

    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch paginated products"
    );

  }

};