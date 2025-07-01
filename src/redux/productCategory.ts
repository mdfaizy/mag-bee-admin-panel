
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface ProductCategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = productCategorySlice.actions;
export default productCategorySlice.reducer;
