// import  axios,{AxiosResponse} from "axios";
// export const apiConnector = async <T = any>(
//   method: string,
//   url: string,
//   body?: object,
//   headers?: object
// ): Promise<AxiosResponse<T>> => {
//   return await axios({
//     method,
//     url,
//     data: body,
//     headers,
//   });
// };


// import axiosInstance from "./axiosInstance";
// import { AxiosResponse } from "axios";

// export const apiConnector = async <T = any>(
//   method: string,
//   url: string,
//   body?: any,
//   headers?: object
// ): Promise<AxiosResponse<T>> => {

//   const isFormData = body instanceof FormData;

//   return axiosInstance({
//     method,
//     url,
//     data: body ?? null,
//     headers: isFormData ? undefined : headers, 
//   });
// };



import axiosInstance from "./axiosInstance";
import { AxiosResponse, Method } from "axios";

export const apiConnector = async <T = any>(
  method: Method,
  url: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<AxiosResponse<T>> => {
  const isFormData = body instanceof FormData;

  return axiosInstance({
    method,
    url,
    ...(body !== undefined && { data: body }),
    headers: {
      ...headers,
      ...(isFormData ? {} : headers),
    },
  });
};
