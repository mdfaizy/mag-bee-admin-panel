import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/components/types/product';

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
     addProduct(state, action: PayloadAction<Product>) {
      state.products.unshift(action.payload); // 🔥 optimistic update
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    toggleProduct(state, action: PayloadAction<number>) {
      const product = state.products.find(p => p.id === action.payload);
      if (product) product.isActive = !product.isActive;
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
  addProduct,
  removeProduct,
  toggleProduct,
  setSelectedProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
