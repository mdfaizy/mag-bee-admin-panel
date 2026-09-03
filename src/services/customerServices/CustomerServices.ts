import { apiConnector } from "@/services/apiConnector";
import { BASE_URL, endPointCustomer } from "../apis";
import { Customer } from "@/components/types/customer";


const { GET_ALL_CUSTOMER,DELETE_BYID_CUSTOMER,UPDATE_CUSTOMER} = endPointCustomer;

export const fetchCustomer = async (): Promise<Customer[]> => {
  const response = await apiConnector("GET", GET_ALL_CUSTOMER);
  console.log("API raw response:", response);

  // Abhi response.data.data me array hai
  return response.data.data as Customer[];
};

export async function toggleUserStatus(id: number) {
 
  try {
    const response = await apiConnector(
      "PATCH",`${BASE_URL}/customers/${id}/toggle`);
    console.log("Response:", response); // Log the response from the server
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error; // Rethrow the error to be caught in the calling function
  }
}
