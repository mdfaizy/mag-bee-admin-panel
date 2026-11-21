// import { AppDispatch } from "@/redux/store";
// import { endPointBanner } from "../apis";
// import { apiConnector } from "@/services/apiConnector";
// import { addBanner } from "@/redux/bannerSlice";
// import { toast } from "react-toastify";
// import { updateBanner ,setSelectedBanner,removeBanner,} from "@/redux/bannerSlice";

// const { CREATE_BANNER, BANNER_GELL_ALL,UPDATE_BANNER,GET_BANNER_BY_ID,DELETE_BANNER,TOGGLE_BANNER_STATUS,} = endPointBanner;
// export const createOfferBanner =
//   ({ formData, router }: { formData: FormData; router: any }) =>
//   async (dispatch: AppDispatch) => {
//     try {
      
//       const res = await apiConnector("POST", CREATE_BANNER, formData);

//       dispatch(addBanner(res.data));
//       toast.success("Banner created successfully");
//       router.push("/banner-slider");
//     } catch (error: any) {
//       toast.error(error.message || "Banner creation failed");
//     }
//   };
//   export const fetchBanner = async () => {
//   const res = await apiConnector("GET", BANNER_GELL_ALL, undefined, {
//   });
//   return res.data;
// };


// export const fetchBannerById =
//   (id: number) => async (dispatch: AppDispatch) => {
//     try {
//       const res = await apiConnector(
//         "GET",
//         endPointBanner.GET_BANNER_BY_ID(id));

//       console.log("Banner by ID response:", res);
//       // ✅ ONLY DATA
//       dispatch(setSelectedBanner(res.data.banner));
//     } catch {
//       toast.error("Failed to load banner");
      
//     }
//   };


// /* ---------------- UPDATE BANNER ---------------- */

// export const updateOfferBanner =
//   ({
//     id,
//     formData,
//     onSuccess,
//   }: {
//     id: number;
//     formData: FormData;
//     onSuccess: () => void;
//   }) =>
//   async (dispatch: AppDispatch) => {
//     try {
//       const res = await apiConnector(
//         "PUT",
//         UPDATE_BANNER(id),
//         formData
//       );

//       dispatch(updateBanner(res.data.banner));

//       toast.success("Banner updated successfully");

//       onSuccess();
//     } catch (error: any) {
//       toast.error(error?.message || "Banner update failed");
//     }
//   };


//   export const deleteOfferBanner =
//   (id: number) => async (dispatch: AppDispatch) => {
//     try {
//       await apiConnector("DELETE", DELETE_BANNER(id));

//       dispatch(removeBanner(id));

//       toast.success("Banner deleted successfully");
//     } catch (error: any) {
//       toast.error("Failed to delete banner");
//       throw error;
//     }
//   };


// /* ---------------- TOGGLE STATUS ---------------- */

// export const toggleBannerStatus =
//   (id: number) => async (dispatch: AppDispatch) => {
//     try {
//       const res = await apiConnector(
//         "PATCH",
//         TOGGLE_BANNER_STATUS(id)
//       );

//       dispatch(updateBanner(res.data.banner));

//       toast.success(
//         `Banner is now ${
//           res.data.banner.isActive ? "Active" : "Inactive"
//         }`
//       );

//       return res.data.banner;
//     } catch (error: any) {
//       toast.error("Failed to update banner status");
//       throw error;
//     }
//   };


import { AppDispatch } from "@/redux/store";
import { endPointBanner } from "../apis";
import { apiConnector } from "@/services/apiConnector";
import {
  addBanner,
  updateBanner,
  setSelectedBanner,
  removeBanner,
} from "@/redux/bannerSlice";
import { toast } from "react-toastify";

const {
  CREATE_BANNER,
  BANNER_GELL_ALL,
  UPDATE_BANNER,
  GET_BANNER_BY_ID,
  DELETE_BANNER,
  TOGGLE_BANNER_STATUS,
} = endPointBanner;


/* =========================================================
   CREATE BANNER
========================================================= */

export const createOfferBanner =
  ({
    formData,
    router,
  }: {
    formData: FormData;
    router: any;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      const res = await apiConnector(
        "POST",
        CREATE_BANNER,
        formData
      );

      /*
       * API response:
       * {
       *   message,
       *   banner
       * }
       *
       * इसलिए banner ही Redux में डालना है.
       */
      dispatch(addBanner(res.data.banner));

      toast.success(
        "Banner created successfully"
      );

      router.push("/banner-slider");

    } catch (error: any) {

      toast.error(
        error?.message ||
          "Banner creation failed"
      );
    }
  };


/* =========================================================
   GET ALL BANNERS
========================================================= */

export const fetchBanner = async () => {

  const res = await apiConnector(
    "GET",
    BANNER_GELL_ALL,
    undefined
  );

  return res.data;
};


/* =========================================================
   GET BANNER BY ID
========================================================= */

export const fetchBannerById =
  (id: number) =>
  async (dispatch: AppDispatch) => {

    try {

      const res = await apiConnector(
        "GET",
        GET_BANNER_BY_ID(id)
      );

      console.log(
        "Banner by ID response:",
        res
      );

      dispatch(
        setSelectedBanner(
          res.data.banner
        )
      );

    } catch {

      toast.error(
        "Failed to load banner"
      );
    }
  };


/* =========================================================
   UPDATE BANNER
========================================================= */

export const updateOfferBanner =
  ({
    id,
    formData,
    onSuccess,
  }: {
    id: number;
    formData: FormData;
    onSuccess: () => void;
  }) =>
  async (dispatch: AppDispatch) => {

    try {

      const res = await apiConnector(
        "PUT",
        UPDATE_BANNER(id),
        formData
      );

      /*
       * API returns:
       * res.data.banner
       */
      dispatch(
        updateBanner(
          res.data.banner
        )
      );

      toast.success(
        "Banner updated successfully"
      );

      onSuccess();

    } catch (error: any) {

      toast.error(
        error?.message ||
          "Banner update failed"
      );
    }
  };


/* =========================================================
   DELETE BANNER
========================================================= */

export const deleteOfferBanner =
  (id: number) =>
  async (dispatch: AppDispatch) => {

    try {

      await apiConnector(
        "DELETE",
        DELETE_BANNER(id)
      );

      dispatch(
        removeBanner(id)
      );

      toast.success(
        "Banner deleted successfully"
      );

    } catch (error: any) {

      toast.error(
        "Failed to delete banner"
      );

      throw error;
    }
  };


/* =========================================================
   TOGGLE BANNER ENABLE / DISABLE
========================================================= */

export const toggleBannerStatus =
  (id: number) =>
  async (dispatch: AppDispatch) => {

    try {

      const res = await apiConnector(
        "PATCH",
        TOGGLE_BANNER_STATUS(id)
      );

      const banner =
        res.data.banner;

      /*
       * Redux update
       */
      dispatch(
        updateBanner(banner)
      );

      /*
       * IMPORTANT:
       *
       * Admin toggle = isEnabled
       *
       * isActive is controlled by
       * backend date logic.
       */
      toast.success(
        `Banner is now ${
          banner.isEnabled
            ? "Enabled"
            : "Disabled"
        }`
      );

      return banner;

    } catch (error: any) {

      toast.error(
        error?.message ||
          "Failed to update banner status"
      );

      throw error;
    }
  };