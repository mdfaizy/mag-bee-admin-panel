

import { apiConnector } from "@/services/apiConnector";
import { endPointCustomer } from "../apis";



const { GET_ALL_CUSTOMER,DELETE_BYID_CUSTOMER,UPDATE_CUSTOMER} = endPointCustomer;

interface Customer {
 id: number;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  // role_id: number;
  is_active: boolean;
  createdAt?: string;
}



// export const fetchCustomer = async (): Promise<{ data: Customer[] }> => {
//   const response = await apiConnector<Customer[]>("GET", GET_ALL_CUSTOMER);
//   console.log(response);
//   return { data: response.data.data }; // 👈 wrap inside object
// };


export const fetchCustomer = async (): Promise<Customer[]> => {
  const response = await apiConnector("GET", GET_ALL_CUSTOMER);
  console.log("API raw response:", response);

  // Abhi response.data.data me array hai
  return response.data.data as Customer[];
};







export async function toggleUserStatus(id: number) {
  const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
  console.log("Token:", token); // Check if the token is being retrieved correctly

  try {
    const response = await apiConnector(
      "PATCH",
      `http://localhost:8000/api/customers/${id}/toggle`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("Response:", response); // Log the response from the server
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error; // Rethrow the error to be caught in the calling function
  }
}
