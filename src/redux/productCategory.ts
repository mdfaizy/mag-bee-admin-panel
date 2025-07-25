import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../utils/type'
// interface Category {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl: string;
//   slug:string,
//   createdAt?: string;
//   updatedAt?: string;
// }

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
  setLoading,
  setError,
  setSelectedCategory,
} = productCategorySlice.actions;

export default productCategorySlice.reducer;
