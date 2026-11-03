import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/components/types/category';
interface ProductCategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}
const initialState: ProductCategoryState = {
  categories: [],
  selectedCategory: null,
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
     updateCategory(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        c => c.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },

    removeCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        c => c.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  setCategories,
  updateCategory,
  removeCategory,
  setLoading,
  setError,
  setSelectedCategory,
} = productCategorySlice.actions;

export default productCategorySlice.reducer;
