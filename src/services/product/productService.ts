
// // import { AppDispatch } from "@/redux/store";
// // import { toast } from "react-toastify";
// import { apiConnector } from "@/services/apiConnector";
// import { endpointsProduct } from "../apis";
// // import { setCategories } from "../../redux/productCategory";
// // import { AxiosError } from "axios";

// const { PRODUCT_GELL_ALL} = endpointsProduct;

// // interface CreateCategoryParams {
// //   categoryName: string;
// //   description: string;
// //   router: any;
// // }

// // export const createCategory = ({
// //   categoryName,
// //   description,
// //   router,
// // }: CreateCategoryParams) => {
// //   return async (dispatch: AppDispatch) => {
// //     const toastId = toast.loading("Creating Category...");

// //     try {
// //       const rawToken = localStorage.getItem("token");
// //       const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

// //       const res = await apiConnector<any>(
// //         "POST",
// //         CREATE_CATEGORY_API,
// //         {
// //           name: categoryName,
// //           description,
// //         },
// //         {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         }
// //       );

// //       // ✅ Category created: update Redux store
// //       dispatch(setCategories([res.data]));

// //       toast.success("Product category created successfully!");
// //       router.push("/product-category");

// //     } catch (err) {
// //       const error = err as AxiosError;
// //       const errMessage =
// //         (error.response?.data as any)?.message || error.message || "Category creation failed.";

// //       // ✅ Handle duplicate category error
// //       if (errMessage === "Category already exists") {
// //         toast.error("Category already exists. Please use a different name.");
// //       } else {
// //         toast.error(errMessage);
// //       }
// //     } finally {
// //       toast.dismiss(toastId);
// //     }
// //   };
// // };




// export const fetchProductAll = async () => {
//   const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
//   const res = await apiConnector("GET", PRODUCT_GELL_ALL, null, {
//     Authorization: `Bearer ${token}`,
//   });
//   return res.data;
// };




import { apiConnector } from "../apiConnector";
import { endpointsProduct } from "../apis"; 
const { PRODUCT_GELL_ALL} = endpointsProduct;

export const fetchProductAll = async () => {
  try {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    const res = await apiConnector("GET", PRODUCT_GELL_ALL, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data;
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  }
};
