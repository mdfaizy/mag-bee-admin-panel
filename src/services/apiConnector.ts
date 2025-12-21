import  axios,{AxiosResponse} from "axios";
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
