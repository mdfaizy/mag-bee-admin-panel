



export interface ProductImage {
  id: number;
  imageUrl: string;
  [key: string]: any;
}



export interface VariantAttribute {
  id?: number;
  key: string;
  value: string;
}

export interface Variant {
    id?: number;
sku: string;
  price: number;
sellingPrice: number;
stock: number;

  offer?: number;
  attributes: { key: string; value: string }[];
}



export interface Product {
  id: number;
    name: string;
  category?: {
    id: number;
    name: string;
  };

  subCategory?: {
    id: number;
    name: string;
  };
  description: string;
  material: string;
   isActive?: boolean;
  keywords: string[];
  price: string;
  manufactureDetails:string;
  url:string;
  originalPrice: string;
  offer: string;
  stock: number;
  // originalPrice: number;
  // offer: number;
  finalPrice: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  weightUnit: string;
  // stock: string;
  shippingAvailable: boolean;
  variantGroupId?: number;
  skuCode: string;
  returnPolicy: string;
  warrantyInfo: string;
  images?: ProductImage[];
  variants: Variant[];
   imageUrl: string;
   

 
  hasVariants?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
