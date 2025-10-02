// src/services/apis.ts
export const BASE_URL = "http://localhost:8000/api";

export const endpoints = {
  SIGNUP_API: `${BASE_URL}/register`,
  LOGIN_API: `${BASE_URL}/login`,
  USER_LIST_API:`${BASE_URL}/users`,
 
};


export const endpointsCategory={
   CREATE_CATEGORY_API:`${BASE_URL}/category`,
   PRODUCT_CATEGORY_GET_ALL:`${BASE_URL}/category`
}

export const endpointsProduct={
  PRODUCT_GELL_ALL:`${BASE_URL}/products`,
  PRODUCT_BY_ID: `${BASE_URL}/products/id`,
}


export const endpointsOrder = {
  ORDER_GET_ALL: `${BASE_URL}/orders/get-order`,
};

export const endPointCustomer={
    GET_ALL_CUSTOMER:`${BASE_URL}/customers`,
    DELETE_BYID_CUSTOMER:`${BASE_URL}/customer/id`,
    UPDATE_CUSTOMER:`${BASE_URL}/customer/id`,
}

export const endPointSubCategory={
  CREATE_SUB_CATEGORY:`${BASE_URL}/subcategories`,
  SUB_CATEGORY_GELL_ALL:`${BASE_URL}/subcategories`,
  UPDATE_SUB_CATEGORY:`${BASE_URL}/subcategories`,

}
