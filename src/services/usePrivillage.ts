import { BASE_URL } from "./apis";

export interface PrivilegeOption {
  id: number;
  name: string;
}


const API_BASE_URL = BASE_URL;



export async function fetchPrivileges(token: string): Promise<PrivilegeOption[]> {
  const res = await fetch(`${API_BASE_URL}/privileges`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch privileges");
  }
  const data = await res.json();
  return data.data || [];
}