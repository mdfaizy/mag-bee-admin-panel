import { AppDispatch } from "@/redux/store";
import { endPointBanner } from "../apis";
import { apiConnector } from "@/services/apiConnector";
import { addBanner } from "@/redux/bannerSlice";
import { toast } from "react-toastify";
import { updateBanner ,setSelectedBanner} from "@/redux/bannerSlice";

const { CREATE_BANNER, BANNER_GELL_ALL,UPDATE_BANNER,GET_BANNER_BY_ID,DELETE_BANNER} = endPointBanner;
export const createOfferBanner =
  ({ formData, router }: { formData: FormData; router: any }) =>
  async (dispatch: AppDispatch) => {
    try {
      
      const res = await apiConnector("POST", CREATE_BANNER, formData);

      dispatch(addBanner(res.data));
      toast.success("Banner created successfully");
      router.push("/banners");
    } catch (error: any) {
      toast.error(error.message || "Banner creation failed");
    }
  };
  export const fetchBanner = async () => {
  const res = await apiConnector("GET", BANNER_GELL_ALL, undefined, {
  });
  return res.data;
};


export const fetchBannerById =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      const res = await apiConnector(
        "GET",
        endPointBanner.GET_BANNER_BY_ID(id));

      console.log("Banner by ID response:", res);
      // ✅ ONLY DATA
      dispatch(setSelectedBanner(res.data.banner));
    } catch {
      toast.error("Failed to load banner");
      
    }
  };


/* ---------------- UPDATE BANNER ---------------- */
export const updateOfferBanner =
  ({ id, formData, onSuccess }: { id: number; formData: FormData; onSuccess: () => void }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await apiConnector(
        "PUT",
        endPointBanner.UPDATE_BANNER(id));

      dispatch(updateBanner(res.data));
      toast.success("Banner updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Banner update failed");
    }
  };

export const toggleBannerStatus =
  (id: number) => async (dispatch: AppDispatch) => {
    try {
      const res = await apiConnector(
        "PATCH",
        endPointBanner.TOGGLE_BANNER_STATUS(id));

      dispatch(updateBanner(res.data));

      toast.success(
        `Banner is now ${res.data.isActive ? "Active" : "Inactive"}`
      );

      return res.data;
    } catch (error: any) {
      toast.error("Failed to update banner status");
      throw error;
    }
  };
