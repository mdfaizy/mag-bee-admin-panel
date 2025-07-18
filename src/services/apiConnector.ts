import  axios,{AxiosResponse} from "axios";
// import
// export const apiConnector = async (
//   method: "GET" | "POST" | "PUT" | "DELETE"|"PATCH",
//   url: string,
//   body?: any,
//   headers?: any
// ) => {
//   return await axios({
//     method,
//     url,
//     data: body,
//     headers: {
//       ...headers,
//     },
//     withCredentials: true, // ✅ Needed for CORS with cookies/token
//   });
// };


export const apiConnector = async <T = any>(
  method: string,
  url: string,
  body?: object,
  headers?: object
): Promise<AxiosResponse<T>> => {
  return await axios({
    method,
    url,
    data: body,
    headers,
  });
};
