// import { AppDispatch } from "@/redux/store";
// import { toast } from "react-toastify";
// import { apiConnector } from "@/services/apiConnector";
// import { endpointsCategory } from "../apis";
// import { setCategories } from "../../redux/productCategory";
// import { AxiosError } from "axios";

// const { CREATE_CATEGORY_API } = endpointsCategory;

// interface CreateCategoryParams {
//   categoryName: string;
//   description: string;
//   router: any;
// }

// export const createCategory = ({
//   categoryName,
//   description,
//   router,
// }: CreateCategoryParams) => {
//   return async (dispatch: AppDispatch) => {
//     const toastId = toast.loading("Creating Category...");

//     try {
//       const rawToken = localStorage.getItem("token");
//       const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";
//       const permissions = JSON.parse(localStorage.getItem("user") || "{}")?.permissions || [];

//       if (!permissions.includes("CREATE_CATEGORY")) {
//         toast.error("You do not have permission to create categories.");
//         return;
//       }

//       const res = await apiConnector<any>(
//         "POST",
//         CREATE_CATEGORY_API,
//         {
//           name: categoryName,
//           description,
//         },
//         {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         }
//       );

//       // ✅ Duplicate check will throw error
//       dispatch(setCategories([res.data]));

//       toast.success("Product category created successfully!");
//       router.push("/product-category");

//     } catch (err) {
//       const error = err as AxiosError;
//       const errMessage =
//         (error.response?.data as any)?.message || error.message || "Category creation failed.";

//       if (errMessage === "Category already exists") {
//         toast.error("Category already exists. Please use a different name.");
//       } else {
//         toast.error(errMessage);
//       }
//     } finally {
//       toast.dismiss(toastId);
//     }
//   };
// };



import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { apiConnector } from "@/services/apiConnector";
import { endpointsCategory } from "../apis";
import { setCategories } from "../../redux/productCategory";
import { AxiosError } from "axios";

const { CREATE_CATEGORY_API ,PRODUCT_CATEGORY_GET_ALL} = endpointsCategory;

interface CreateCategoryParams {
  categoryName: string;
  description: string;
  router: any;
}

export const createCategory = ({
  categoryName,
  description,
  router,
}: CreateCategoryParams) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Creating Category...");

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await apiConnector<any>(
        "POST",
        CREATE_CATEGORY_API,
        {
          name: categoryName,
          description,
        },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      // ✅ Category created: update Redux store
      dispatch(setCategories([res.data]));

      toast.success("Product category created successfully!");
      router.push("/product-category");

    } catch (err) {
      const error = err as AxiosError;
      const errMessage =
        (error.response?.data as any)?.message || error.message || "Category creation failed.";

      // ✅ Handle duplicate category error
      if (errMessage === "Category already exists") {
        toast.error("Category already exists. Please use a different name.");
      } else {
        toast.error(errMessage);
      }
    } finally {
      toast.dismiss(toastId);
    }
  };
};


export const fetchProductCategory = async () => {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  const res = await apiConnector("GET", PRODUCT_CATEGORY_GET_ALL, null, {
    Authorization: `Bearer ${token}`,
  });
  return res.data;
};