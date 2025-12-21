// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import productCategoryReducer from "./productCategory"
import productReducer from './productSlice'
import SubCategory from './productSubCategory'
import bannerReducer from "./bannerSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    category:productCategoryReducer,
      product: productReducer,
      SubCategoryState:SubCategory,
      banner:bannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
