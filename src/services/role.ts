import { apiConnector } from "./apiConnector";
import { BASE_URL } from "./apis";
export interface RoleOption {
  id: number;
  name: string;
}
const API_BASE_URL = BASE_URL;
export async function fetchRoles(): Promise<RoleOption[]> {
     const res = await apiConnector("GET", `${API_BASE_URL}/roles`,);
  return res.data.roles;
}
