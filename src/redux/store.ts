// // src/redux/store.ts
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import profileReducer from "./profileSlice";
// import productCategoryReducer from "./productCategory"
// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     profile: profileReducer,
//     category:productCategoryReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;



// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import productCategoryReducer from "./productCategory";

import productSlice from './productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    category: productCategoryReducer,
    product:productSlice,
  },
});

// Correct types for useDispatch, useSelector
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;