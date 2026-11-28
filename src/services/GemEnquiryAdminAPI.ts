import { apiConnector } from "./apiConnector";
import type {
  GemEnquiryListResponse,
  GemEnquiryDetailsResponse,
  GemEnquiryUpdatePayload,
  GemEnquiryAPIResponse,
} from "@/components/types/GemEnquiry";

// GET ALL
export const getGemEnquiriesAPI = async (
  queryString = ""
): Promise<GemEnquiryListResponse> => {
  const url = queryString
    ? `/gem-enquiries?${queryString}`
    : "/gem-enquiries";

  const response = await apiConnector("GET", url);
  return response.data;
};

// GET DETAILS
export const getGemEnquiryByIdAPI = async (
  id: number
): Promise<GemEnquiryDetailsResponse> => {
  const response = await apiConnector(
    "GET",
    `/gem-enquiries/${id}`
  );

  return response.data;
};

// UPDATE
export const updateGemEnquiryAPI = async (
  id: number,
  data: GemEnquiryUpdatePayload
): Promise<GemEnquiryAPIResponse> => {
  const response = await apiConnector(
    "PATCH",
    `/gem-enquiries/${id}`,
    data
  );

  return response.data;
};

// DELETE
export const deleteGemEnquiryAPI = async (
  id: number
): Promise<GemEnquiryAPIResponse> => {
  const response = await apiConnector(
    "DELETE",
    `/gem-enquiries/${id}`
  );

  return response.data;
};


export const getGemEnquiryDocumentAPI = async (
  id: number,
  type: "requirement" | "tender"
) => {
  const response = await apiConnector(
    "GET",
    `/gem-enquiries/${id}/document/${type}`
  );

  return response.data;
};