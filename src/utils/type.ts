export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}


export interface UserFromStorage {
  permissions?: string[];
  id?: string;
  name?: string;
  email?: string;
}

export interface ApiResponse {
  message: string;
  data?: unknown;
  status?: string;
}


// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  // ... add other fields as per your backend API
}
