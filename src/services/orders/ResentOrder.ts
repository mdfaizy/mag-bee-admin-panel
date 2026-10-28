import { apiConnector } from "../apiConnector";
import { endpointsOrder } from "../apis";

export const getAllOrders = async (
  page = 1,
  limit = 20
) => {
  try {
    const response = await apiConnector(
      "GET",
      `${endpointsOrder.ORDER_GET_ALL}?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};



export const getAllOrdersForAnalytics = async () => {
  try {
    const firstResponse = await getAllOrders(1, 100);

    const firstOrders = Array.isArray(firstResponse?.orders)
      ? firstResponse.orders
      : Array.isArray(firstResponse)
        ? firstResponse
        : [];

    const total = Number(firstResponse?.total ?? firstOrders.length);
    const limit = 100;
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) {
      return firstOrders;
    }

    const remainingResponses = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        getAllOrders(index + 2, limit)
      )
    );

    return [
      ...firstOrders,
      ...remainingResponses.flatMap((response: any) =>
        Array.isArray(response?.orders) ? response.orders : []
      ),
    ];
  } catch (error) {
    console.error("Error fetching analytics orders:", error);
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
  const url = `http://localhost:8000/api/orders/${orderId}/invoice`;

  // browser me PDF open / download
  window.open(url, "_blank");
};
export const updateOrderStatus = async (
  orderId: string,
  data: { status: string }
) => {
  return apiConnector("PUT", `/orders/${orderId}`, data);
};

/**
 * Cancel with a mandatory reason (same endpoint as status updates; the
 * backend validates the reason and runs the refund / Shiprocket flow).
 */
export const cancelOrderWithReason = async (
  orderId: string,
  data: { cancelReasonCode: string; cancellationNote?: string }
) => {
  return apiConnector("PUT", `/orders/${orderId}`, {
    status: "CANCELLED",
    cancelReasonCode: data.cancelReasonCode,
    cancellationNote: data.cancellationNote?.trim() || undefined,
  });
};



