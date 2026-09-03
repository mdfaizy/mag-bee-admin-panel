export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryOption = {
  value: string;
  label: string;
};

export type SubCategory = {
  value: string;
  label: string;
  categoryId: string;
};

