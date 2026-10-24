import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
console.log(
  "API URL:",
  process.env.NEXT_PUBLIC_API_URL
);
// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const axiosInstance = axios.create({
  // baseURL: "https://ecommerce.magaritatech.com/api",
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
   baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api",
  // baseURL:'http://localhost:8000/api',
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

/*
 * Session handling for the httpOnly-cookie auth:
 * - all simultaneous 401s wait on ONE shared /refresh-token call, then each
 *   request is retried once (no retry loops);
 * - only a refresh answered with 401/403 ends the session: one redirect to
 *   /signin?reason=session_expired;
 * - a network error or 5xx during refresh keeps the user signed in and the
 *   request fails with a normal error the page can show.
 */
export const SESSION_EXPIRED_PATH = "/signin?reason=session_expired";

type SessionRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

export type SessionAwareError = AxiosError & {
  sessionExpired?: boolean;
  refreshFailedTemporarily?: boolean;
};

const AUTH_ENDPOINTS = ["/login", "/refresh-token", "/logout", "/verify-email", "/forgot-password", "/reset-password"];

const isAuthEndpoint = (url = "") => {
  const path = url.split("?")[0];
  return AUTH_ENDPOINTS.some((endpoint) => path === endpoint || path.endsWith(endpoint));
};

let refreshPromise: Promise<unknown> | null = null;
let redirectingToSignIn = false;

/** One refresh at a time; concurrent callers share the same request */
export const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post("/refresh-token", null, { skipAuthRefresh: true } as SessionRequestConfig)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const endSession = () => {
  if (redirectingToSignIn) return;
  redirectingToSignIn = true;

  try {
    localStorage.removeItem("user");
  } catch {
    // storage unavailable: nothing to clear
  }

  if (window.location.pathname !== "/signin") {
    window.location.assign(SESSION_EXPIRED_PATH);
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: SessionAwareError) => {
    const originalRequest = error.config as SessionRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
    } catch (refreshError) {
      const failure = refreshError as SessionAwareError;
      const refreshStatus = failure.response?.status;

      if (refreshStatus === 401 || refreshStatus === 403) {
        error.sessionExpired = true;
        endSession();
        return Promise.reject(error);
      }

      // Offline / server trouble: the session may be fine, keep it
      failure.refreshFailedTemporarily = true;
      return Promise.reject(failure);
    }

    return axiosInstance(originalRequest);
  }
);


export default axiosInstance;
