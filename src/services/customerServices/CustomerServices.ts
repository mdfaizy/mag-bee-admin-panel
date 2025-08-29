

import { apiConnector } from "@/services/apiConnector";
import { endPointCustomer } from "../apis";



const { GET_ALL_CUSTOMER,DELETE_BYID_CUSTOMER,UPDATE_CUSTOMER} = endPointCustomer;

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
}

export const fetchCustomer = async (): Promise<Customer[]> => {
  const response = await apiConnector<Customer[]>("GET", GET_ALL_CUSTOMER);
  return response.data;
};

// export const fetchCustomer = async () => {
//   const res = await apiConnector("GET", GET_ALL_CUSTOMER, undefined, {
//   });
//   return res.data;
// };






export const deleteCategory = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const toastId = toast.loading("Deleting category...", { position: "top-center" ,style: { zIndex: 100 }});

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");

      await apiConnector(
        "DELETE",
        `http://localhost:8000/api/category/${id}`,
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success("Category deleted successfully!", { position: "top-center" });

      // Optionally refetch updated list after deletion
      const updatedList = await fetchProductCategory();
      dispatch(setCategories(updatedList));
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "Delete failed.";
      toast.error(errMsg, { position: "top-center" ,style: { zIndex: 100 }});
    } finally {
      toast.dismiss(toastId);
    }
  };
};




