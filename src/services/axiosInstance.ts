import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  // baseURL: "https://ecommerce.magaritatech.com/api",
  // baseURL:process.env.NEXT_PUBLIC_API_URL;
  baseURL:'http://localhost:8000/api',
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // ✅ refresh-token ko retry loop se bahar rakho
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       try {
//         await axiosInstance.post("/refresh-token");

//         return axiosInstance(originalRequest);
//       } catch (err) {
//         console.error("Refresh token expired → redirect to login");
//         window.location.href = "/signin";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ✅ Skip refresh if flag is set
    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/refresh-token");
        return axiosInstance(originalRequest);
      } catch (err) {
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
