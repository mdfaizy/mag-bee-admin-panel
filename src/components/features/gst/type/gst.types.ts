export interface GstRate {
  id: number;
  rateName: string;
  totalRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;

  isActive: boolean;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductOption {
  id: number;
  name: string;
  skuCode?: string;
}

export interface HsnMaster {
  id: number;
  hsnCode: string;
  description: string;
  chapterName: string | null;
  isActive: boolean;
  remarks: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHsnPayload {
  hsnCode: string;
  description: string;
  chapterName?: string | null;
  remarks?: string | null;
}

export interface ProductTaxMapping {
  id: number;
  productId: number;
  hsnCode: number;
  gstRateId: number;
  isActive: boolean;
  remarks: string | null;

  product?: {
    id: number;
    name: string;
  };

  hsn?: HsnMaster;
  gstRate?: GstRate;
}

export interface CreateGstRatePayload {
  rateName: string;
  totalRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;

  description?: string | null;
}

export interface CreateProductTaxMappingPayload {
  productId: number;
  hsnId: number;
  gstRateId: number;
 
  remarks?: string | null;
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}
