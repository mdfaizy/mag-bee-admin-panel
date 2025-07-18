// src/services/apis.ts
const BASE_URL = "http://localhost:8000/api";

export const endpoints = {
  SIGNUP_API: `${BASE_URL}/register`,
  LOGIN_API: `${BASE_URL}/login`,
  USER_LIST_API:`${BASE_URL}/users`,
 
};


export const endpointsCategory={
   CREATE_CATEGORY_API:`${BASE_URL}/products/category`,
   PRODUCT_CATEGORY_GET_ALL:`${BASE_URL}/products/category`
}

export const endpointsProduct={
  PRODUCT_GELL_ALL:`${BASE_URL}/products/products`,
 PRODUCT_CREATE:`${BASE_URL}/products/product`,
  //  PRODUCT_GELL_ALL: "/api/products",
  // PRODUCT_CREATE: "/api/products/product",
  // products/product
  // PRODUCT_DELETE: "/api/products", // DELETE /:id
  // PRODUCT_UPDATE: "/api/products",
}

// apis/index.ts

// export const endpointsProduct = {
//   PRODUCT_GELL_ALL: "/api/products",
//   PRODUCT_CREATE: "/api/products/product",
//   PRODUCT_DELETE: "/api/products", // DELETE /:id
//   PRODUCT_UPDATE: "/api/products", // PUT /:id
// };
