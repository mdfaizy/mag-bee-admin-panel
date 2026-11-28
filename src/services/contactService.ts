import { apiConnector } from "./apiConnector";

// =====================================================
// GET ALL CONTACTS
// =====================================================

export const getAllContactsAPI = async () => {
  const response = await apiConnector(
    "GET",
    "/contact"
  );

  return response.data;
};

// =====================================================
// UPDATE CONTACT STATUS
// =====================================================

export const updateContactStatusAPI = async (
  id: number,
  data: {
    status: string;
    resolutionMessage?: string;
  }
) => {
  const response = await apiConnector(
    "PUT",
    `/contact/${id}/status`,
    data
  );

  return response.data;
};