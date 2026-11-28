
import { apiConnector } from "./apiConnector";

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

export const getAllNotificationsAPI = async (
  page = 1,
  limit = 20
) => {
  const response = await apiConnector(
    "GET",
    `/notifications?page=${page}&limit=${limit}`
  );

  return response.data;
};

// =====================================================
// GET UNREAD NOTIFICATION COUNT
// =====================================================

export const getUnreadNotificationCountAPI = async () => {
  const response = await apiConnector(
    "GET",
    "/notifications/unread-count"
  );

  return response.data;
};

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsReadAPI = async (id: number) => {
  const response = await apiConnector(
    "PATCH",
    `/notifications/${id}/read`
  );

  return response.data;
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsReadAPI = async () => {
  const response = await apiConnector(
    "PATCH",
    "/notifications/read-all"
  );

  return response.data;
};

// =====================================================
// DELETE NOTIFICATION
// =====================================================

export const deleteNotificationAPI = async (id: number) => {
  const response = await apiConnector(
    "DELETE",
    `/notifications/${id}`
  );

  return response.data;
};
