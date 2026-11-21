import { apiConnector } from "./apiConnector";
import { BASE_URL } from "./apis";

export interface PrivilegeOption {
  id: number;
  name: string;
}
const API_BASE_URL = BASE_URL;
export async function fetchPrivileges(): Promise<PrivilegeOption[]> {
  const res = await apiConnector("GET", `${API_BASE_URL}/privileges`);
  return res.data.data || [];
}