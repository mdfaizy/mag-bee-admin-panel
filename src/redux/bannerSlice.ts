// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// /* -------------------- TYPES -------------------- */
// export interface Banner {
//   id: number;
//   title: string;
//   subtitle?: string;
//   link?: string;
//   imageUrl: string;
//   startDate?: string;
//   endDate?: string;
//   isActive: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface BannerState {
//   banners: Banner[];
//   selectedBanner: Banner | null;
//   loading: boolean;
//   error: string | null;
// }

// /* -------------------- INITIAL STATE -------------------- */
// const initialState: BannerState = {
//   banners: [],
//   selectedBanner: null,
//   loading: false,
//   error: null,
// };

// /* -------------------- SLICE -------------------- */
// const bannerSlice = createSlice({
//   name: "banner",
//   initialState,
//   reducers: {
//     /* SET ALL BANNERS */
//     setBanners: (state, action: PayloadAction<Banner[]>) => {
//       state.banners = action.payload;
//     },

//     /* ADD NEW BANNER */
//     addBanner: (state, action: PayloadAction<Banner>) => {
//       state.banners.unshift(action.payload);
//     },

//     /* SELECT BANNER (FOR VIEW / EDIT) */
//     setSelectedBanner: (state, action: PayloadAction<Banner | null>) => {
//       state.selectedBanner = action.payload;
      
//     },

//     /* UPDATE BANNER (🔥 IMPORTANT) */
//     // updateBanner: (state, action: PayloadAction<Banner>) => {
//     //   const index = state.banners.findIndex(
//     //     (b) => b.id === action.payload.id
//     //   );
//     //   if (index !== -1) {
//     //     state.banners[index] = action.payload;
//     //   }
//     //   if (
//     //     state.selectedBanner &&
//     //     state.selectedBanner.id === action.payload.id
//     //   ) {
//     //     state.selectedBanner = action.payload;
//     //   }
//     // },
    

//     updateBanner: (state, action) => {
//   const updated = action.payload.banner || action.payload;

//   state.banners = state.banners.map(b =>
//     b.id === updated.id ? updated : b
//   );
// },
// removeBanner: (state, action: PayloadAction<number>) => {
//       state.banners = state.banners.filter(
//         (banner) => banner.id !== action.payload
//       );
//     },

//     /* LOADING */
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//   },
// });

// /* -------------------- EXPORTS -------------------- */
// export const {
//   setBanners,
//   addBanner,
//   setSelectedBanner,
//   updateBanner,
//   removeBanner,
//   setLoading,
// } = bannerSlice.actions;

// export default bannerSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* =========================================================
   TYPES
========================================================= */

export interface Banner {
  id: number;

  title: string;

  subtitle?: string;

  link?: string;

  imageUrl: string;

  startDate?: string;

  endDate?: string;

  /*
   * Admin manually controls this
   */
  isEnabled: boolean;

  /*
   * Backend automatically controls this
   */
  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}


/* =========================================================
   STATE
========================================================= */

interface BannerState {
  banners: Banner[];

  selectedBanner: Banner | null;

  loading: boolean;

  error: string | null;
}


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: BannerState = {
  banners: [],

  selectedBanner: null,

  loading: false,

  error: null,
};


/* =========================================================
   SLICE
========================================================= */

const bannerSlice = createSlice({
  name: "banner",

  initialState,

  reducers: {

    /* =====================================================
       SET ALL BANNERS
    ===================================================== */

    setBanners: (
      state,
      action: PayloadAction<Banner[]>
    ) => {

      state.banners =
        action.payload;

    },


    /* =====================================================
       ADD NEW BANNER
    ===================================================== */

    addBanner: (
      state,
      action: PayloadAction<Banner>
    ) => {

      /*
       * Prevent duplicate banner
       */

      const exists =
        state.banners.some(
          (banner) =>
            banner.id ===
            action.payload.id
        );

      if (!exists) {

        state.banners.unshift(
          action.payload
        );

      }

    },


    /* =====================================================
       SELECT BANNER
    ===================================================== */

    setSelectedBanner: (
      state,
      action: PayloadAction<Banner | null>
    ) => {

      state.selectedBanner =
        action.payload;

    },


    /* =====================================================
       UPDATE BANNER
    ===================================================== */

    updateBanner: (
      state,
      action: PayloadAction<Banner>
    ) => {

      const updated =
        action.payload;

      /*
       * Update banner in list
       */

      const index =
        state.banners.findIndex(
          (banner) =>
            banner.id ===
            updated.id
        );

      if (index !== -1) {

        state.banners[index] =
          updated;

      } else {

        /*
         * If banner doesn't exist,
         * add it.
         */

        state.banners.unshift(
          updated
        );

      }


      /*
       * Update selected banner
       */

      if (
        state.selectedBanner &&
        state.selectedBanner.id ===
          updated.id
      ) {

        state.selectedBanner =
          updated;

      }

    },


    /* =====================================================
       REMOVE BANNER
    ===================================================== */

    removeBanner: (
      state,
      action: PayloadAction<number>
    ) => {

      state.banners =
        state.banners.filter(
          (banner) =>
            banner.id !==
            action.payload
        );


      /*
       * Clear selected banner
       * if deleted
       */

      if (
        state.selectedBanner &&
        state.selectedBanner.id ===
          action.payload
      ) {

        state.selectedBanner =
          null;

      }

    },


    /* =====================================================
       LOADING
    ===================================================== */

    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {

      state.loading =
        action.payload;

    },

  },
});


/* =========================================================
   EXPORTS
========================================================= */

export const {
  setBanners,
  addBanner,
  setSelectedBanner,
  updateBanner,
  removeBanner,
  setLoading,
} = bannerSlice.actions;


export default bannerSlice.reducer;