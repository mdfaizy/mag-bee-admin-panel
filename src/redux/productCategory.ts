
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = productCategorySlice.actions;
export default productCategorySlice.reducer;
