// redux/features/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  offer: number; // percentage value
  finalPrice: number;
  category: {
    id: string;
    name: string;
  };
  url: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
