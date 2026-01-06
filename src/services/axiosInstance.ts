// import axios from "axios";
// import { BASE_URL } from "./apis";

// const axiosInstance = axios.create({
//   baseURL: "http://195.250.30.134:8000/api",
//   // baseURL:BASE_URL,
//   withCredentials: true,
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//      !originalRequest.url.includes("/login") &&
//   !originalRequest.url.includes("/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       try {
//         await axiosInstance.post("/refresh-token");
//         return axiosInstance(originalRequest);
//       } catch {
//         if (!window.location.pathname.includes("/signin")) {
//           window.location.href = "/signin";
//         }
//       }
      

//     }

//     return Promise.reject(error);
//   }
// );




// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce.magaritatech.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ refresh-token ko retry loop se bahar rakho
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/refresh-token");

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token expired → redirect to login");
        window.location.href = "/signin";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
