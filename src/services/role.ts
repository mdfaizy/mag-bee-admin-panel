import { BASE_URL } from "./apis";

export interface RoleOption {
  id: number;
  name: string;
}

const API_BASE_URL = BASE_URL;

export async function fetchRoles(token: string): Promise<RoleOption[]> {
  const res = await fetch(`${API_BASE_URL}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch roles");
  }
  const data = await res.json();
  return data.roles;
}
