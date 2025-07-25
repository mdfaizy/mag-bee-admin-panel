// types.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  offer: number; // percentage value
  finalPrice: number;
  category: {
    id: string;
    name: string;
  };
  url: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone_number: string;
  role_id: number;
  is_active: boolean;
  createdAt?: string; // add this if you're using it
  role?: Role; // ✅ Add this
}