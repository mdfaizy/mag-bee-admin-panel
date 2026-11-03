// import { apiConnector } from "./apiConnector";

// // =====================================================
// // GET ALL CONTACTS
// // =====================================================
// export const getAllContactsAPI = async () => {
//   const response = await apiConnector(
//     "GET",
//     "/contact"
//   );

//   return response.data;
// };

// // =====================================================
// // UPDATE CONTACT STATUS
// // =====================================================
// export const updateContactStatusAPI =
//   async (id, data) => {
//     const response = await apiConnector(
//       "PUT",
//       `/contact/status/${id}`,
//       data
//     );

//     return response.data;
//   };

import { apiConnector } from "./apiConnector";

// =====================================================
// GET ALL CONTACTS
// =====================================================
export const getAllContactsAPI =
  async () => {
    const response =
      await apiConnector(
        "GET",
        "/contact"
      );

    return response.data;
  };

// =====================================================
// UPDATE CONTACT STATUS
// =====================================================
export const updateContactStatusAPI =
  async (
    id: number,

    data: {
      isResolved: boolean;

      resolutionMessage: string;
    }
  ) => {
    const response =
      await apiConnector(
        "PUT",

        `/contact/status/${id}`,

        data
      );

    return response.data;
  };