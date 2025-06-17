
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
