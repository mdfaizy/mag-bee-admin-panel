import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubCategoryState {
  subCategories: any[];
  selectedSubCategory: any | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    setSubCategories: (state, action: PayloadAction<any[]>) => {
      state.subCategories = action.payload;
    },
    setSelectedSubCategory: (state, action: PayloadAction<any | null>) => {
      state.selectedSubCategory = action.payload;
    },
  },
});

export const { setSubCategories, setSelectedSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
