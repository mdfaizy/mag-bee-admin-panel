import { apiConnector } from "@/services/apiConnector";
import {
  GstRate,
  HsnMaster,
  ProductTaxMapping,
  CreateGstRatePayload,
  CreateHsnPayload,
  CreateProductTaxMappingPayload,
  ApiListResponse,
} from "../type/gst.types";
// ==============================
// GST RATE APIs
// ==============================
export const createGstRateAPI = (data: CreateGstRatePayload) => {
  return apiConnector("POST", "/gst-rates", data);
};
export const getAllGstRatesAPI = () => {
  return apiConnector<ApiListResponse<GstRate>>("GET", "/gst-rates");
};
export const getGstRateByIdAPI = (id: number) => {
  return apiConnector<GstRate>("GET", `/gst-rates/${id}`);
};
export const updateGstRateAPI = (
  id: number,
  data: Partial<CreateGstRatePayload>
) => {
  return apiConnector("PATCH", `/gst-rates/${id}`, data);
};
export const updateGstRateStatusAPI = (
  id: number,
  isActive: boolean
) => {
  return apiConnector("PATCH", `/gst-rates/${id}/status`, {
    isActive,
  });
};
// ==============================
// HSN APIs
// ==============================
export const createHsnAPI = (data: CreateHsnPayload) => {
  return apiConnector("POST", "/hsn", data);
};

export const getAllHsnAPI = () => {
  return apiConnector<ApiListResponse<HsnMaster>>("GET", "/hsn");
};

export const getHsnByIdAPI = (id: number) => {
  return apiConnector<HsnMaster>("GET", `/hsn/${id}`);
};

export const updateHsnAPI = (
  id: number,
  data: Partial<CreateHsnPayload>
) => {
  return apiConnector("PATCH", `/hsn/${id}`, data);
};

// ==============================
// PRODUCT TAX MAPPING APIs
// ==============================

export const createProductTaxMappingAPI = (
  data: CreateProductTaxMappingPayload
) => {
  return apiConnector("POST", "/product-tax-mapping", data);
};

export const getAllProductTaxMappingsAPI = () => {
  return apiConnector<ProductTaxMapping[]>(
    "GET",
    "/product-tax-mapping"
  );
};

export const getProductTaxMappingByIdAPI = (id: number) => {
  return apiConnector<ProductTaxMapping>(
    "GET",
    `/product-tax-mapping/${id}`
  );
};

export const updateProductTaxMappingAPI = (
  id: number,
  data: Partial<CreateProductTaxMappingPayload>
) => {
  return apiConnector(
    "PATCH",
    `/product-tax-mapping/${id}`,
    data
  );
};

export const updateProductTaxMappingStatusAPI = (
  id: number,
  isActive: boolean
) => {
  return apiConnector(
    "PATCH",
    `/product-tax-mapping/${id}/status`,
    { isActive }
  );
};

