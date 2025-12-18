import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* -------------------- TYPES -------------------- */
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  link?: string;
  imageUrl: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface BannerState {
  banners: Banner[];
  selectedBanner: Banner | null;
  loading: boolean;
  error: string | null;
}

/* -------------------- INITIAL STATE -------------------- */
const initialState: BannerState = {
  banners: [],
  selectedBanner: null,
  loading: false,
  error: null,
};

/* -------------------- SLICE -------------------- */
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    /* SET ALL BANNERS */
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.banners = action.payload;
    },

    /* ADD NEW BANNER */
    addBanner: (state, action: PayloadAction<Banner>) => {
      state.banners.unshift(action.payload);
    },

    /* SELECT BANNER (FOR VIEW / EDIT) */
    setSelectedBanner: (state, action: PayloadAction<Banner | null>) => {
      state.selectedBanner = action.payload;
      
    },

    /* UPDATE BANNER (🔥 IMPORTANT) */
    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.banners.findIndex(
        (b) => b.id === action.payload.id
      );
      if (index !== -1) {
        state.banners[index] = action.payload;
      }
      if (
        state.selectedBanner &&
        state.selectedBanner.id === action.payload.id
      ) {
        state.selectedBanner = action.payload;
      }
    },

    /* LOADING */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

/* -------------------- EXPORTS -------------------- */
export const {
  setBanners,
  addBanner,
  setSelectedBanner,
  updateBanner,
  setLoading,
} = bannerSlice.actions;

export default bannerSlice.reducer;
