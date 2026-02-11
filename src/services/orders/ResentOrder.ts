import { apiConnector } from "../apiConnector";
import { endpointsOrder } from "../apis";

export const getAllOrders = async () => {
  try {
    const response = await apiConnector("GET", endpointsOrder.ORDER_GET_ALL);
    return response.data; // 👈 backend se jo bhi array aayega
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};


// export const updateOrderStatus = async (orderId: string, status: string) => {
//   try {
//     const response = await apiConnector("PUT", `/orders/${orderId}/status`, { status });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating order status", error);
//     throw error;
//   }
// };

export const downloadInvoice = (orderId: string) => {
  const url = `http://localhost:8000/orders/${orderId}/invoice`;

  // browser me PDF open / download
  window.open(url, "_blank");
};
export const updateOrderStatus = async (
  orderId: string,
  data: { status: string }
) => {
  return apiConnector("PUT", `/orders/${orderId}`, data);
};



