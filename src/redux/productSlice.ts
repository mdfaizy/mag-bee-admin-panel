import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/components/types/product';
// interface VariantAttribute {
//   id?: number;
//   key: string;
//   value: string;
// }

// interface Variant {
//   id?: number;
//   sku: string;
//   price: number;
//   stock: number;
//   attributes: VariantAttribute[];
// }
// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   stock:number;
//   originalPrice: number;
//   offer: number; // percentage value
//   finalPrice: number;
//   category: {
//      id: number;
//     name: string;
//   };
//     subCategory?: {    
//     name: string;
//   };
//   // url: string;
//   images?: {
//     id: number;       // DB id
//     url: string;      // image URL
//     [key: string]: any; // agar extra fields aa rahi hain
//   }[];
//    shippingAvailable?: boolean; 
//   warrantyInfo?: string;
//   skuCode?: string;
//   material?: string;
//   returnPolicy?: string;
//   manufactureDetails?: string;
//   imageUrl: string;
//     variants?: Variant[];  
//   createdAt?: string;
//   updatedAt?: string;
// }


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
