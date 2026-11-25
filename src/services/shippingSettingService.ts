import { apiConnector } from "./apiConnector";

export interface ShippingSettings {
  id?: number;
  freeShippingEnabled: boolean;
  freeShippingMinimum: number;
  defaultShippingCharge: number;
  codEnabled: boolean;
  updatedAt?: string;
}

// GET Shipping Settings
export const getShippingSettingsAPI = async () => {
  return await apiConnector(
    "GET",
    "/shipping-settings"
  );
};

// UPDATE Shipping Settings
export const updateShippingSettingsAPI = async (
  data: Partial<ShippingSettings>
) => {
  return await apiConnector(
    "PUT",
    "/shipping-settings",
    data
  );
};