import axios from "axios";

export const apiConnector = async (
  method: "GET" | "POST" | "PUT" | "DELETE"|"PATCH",
  url: string,
  body?: any,
  headers?: any
) => {
  return await axios({
    method,
    url,
    data: body,
    headers: {
      ...headers,
    },
    withCredentials: true, // ✅ Needed for CORS with cookies/token
  });
};
