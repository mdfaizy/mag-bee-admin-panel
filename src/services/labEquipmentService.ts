
import { apiConnector } from "./apiConnector";

const LAB_EQUIPMENT_API = "/lab-equipment";

// ================= TYPES =================

export interface LabSpecificationInput {
  label: string;
  value: string;
  sortOrder?: number;
}

export interface LabEquipmentMedia {
  id?: number;
  mediaType: "IMAGE" | "VIDEO" | "PDF";
  mediaUrl?: string | null;
  thumbnail?: string | null;
  medium?: string | null;
  large?: string | null;
  publicId?: string | null;
  title?: string | null;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface LabEquipmentFormData {
  name: string;
  productCode: string;
  categoryId: number;
  subCategoryId?: number | null;
  manufacturer?: string;
  modelNumber?: string;
  origin?: string;
  standards?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  specifications: LabSpecificationInput[];
}

export interface LabEquipment {
  id: number;
  name: string;
  productCode: string;
  slug: string | null;
  categoryId: number;
  subCategoryId?: number | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  origin?: string | null;
  standards?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  specifications?: LabSpecificationInput[];
  media?: LabEquipmentMedia[];
  category?: {
    id: number;
    name: string;
  };
  subCategory?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LabEquipmentListResponse {
  equipment?: LabEquipment[];
  data?: LabEquipment[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
  page?: number;
  limit?: number;
}

// ================= CREATE =================

export const createLabEquipmentAPI = async (
  data: FormData
) => {
  return apiConnector(
    "POST",
    LAB_EQUIPMENT_API,
    data
  );
};

// ================= UPDATE =================

export const updateLabEquipmentAPI = async (
  id: number,
  data: FormData
) => {
  return apiConnector(
    "PUT",
    `${LAB_EQUIPMENT_API}/${id}`,
    data
  );
};

// ================= GET ALL =================

export const getAllLabEquipmentAPI = async (
  params?: Record<string, unknown>
) => {
  return apiConnector(
    "GET",
    LAB_EQUIPMENT_API,
    undefined,
    { params }
  );
};

// ================= GET PAGINATED =================

export const getPaginatedLabEquipmentAPI = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    subCategoryId?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  }
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/paginated`,
    undefined,
    { params }
  );
};

// ================= GET BY ID =================

export const getLabEquipmentByIdAPI = async (
  id: number
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/${id}`
  );
};

// ================= DELETE =================

export const deleteLabEquipmentAPI = async (
  id: number
) => {
  return apiConnector(
    "DELETE",
    `${LAB_EQUIPMENT_API}/${id}`
  );
};

// ================= TOGGLE STATUS =================

export const toggleLabEquipmentStatusAPI = async (
  id: number
) => {
  return apiConnector(
    "PATCH",
    `${LAB_EQUIPMENT_API}/${id}/status`
  );
};

// ================= TOGGLE FEATURED =================

export const toggleLabEquipmentFeaturedAPI = async (
  id: number
) => {
  return apiConnector(
    "PATCH",
    `${LAB_EQUIPMENT_API}/${id}/featured`
  );
};

// ================= SEARCH =================

export const searchLabEquipmentAPI = async (
  params: {
    q?: string;
    categoryId?: number;
    subCategoryId?: number;
  }
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/search`,
    undefined,
    { params }
  );
};

// ================= GET FEATURED =================

export const getFeaturedLabEquipmentAPI = async () => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/featured`
  );
};

// ================= GET BY CATEGORY =================

export const getLabEquipmentByCategoryAPI = async (
  categoryId: number
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/category/${categoryId}`
  );
};

// ================= GET BY SUBCATEGORY =================

export const getLabEquipmentBySubCategoryAPI = async (
  subCategoryId: number
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/subcategory/${subCategoryId}`
  );
};

// ================= GET BY CATEGORY SLUG =================

export const getLabEquipmentByCategorySlugAPI = async (
  categorySlug: string
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/category-slug/${encodeURIComponent(categorySlug)}`
  );
};

// ================= GET BY SUBCATEGORY SLUG =================

export const getLabEquipmentBySubCategorySlugAPI = async (
  subCategorySlug: string
) => {
  return apiConnector(
    "GET",
    `${LAB_EQUIPMENT_API}/subcategory-slug/${encodeURIComponent(subCategorySlug)}`
  );
};
