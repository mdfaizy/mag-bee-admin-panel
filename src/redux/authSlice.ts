import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  
}
interface AuthState {
  // token: string | null;
 
  // refreshToken: string | null;
  user: User | null;
  loading: boolean;

}

const initialState: AuthState = {
  // token: null,
  // refreshToken: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setToken: (state, action: PayloadAction<string>) => {
    //   state.token = action.payload;
    // },
    //  setRefreshToken: (state, action: PayloadAction<string>) => {
    //   state.refreshToken = action.payload;
    // },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      // state.token = null;
      // state.refreshToken = null;
      state.user = null;
    },
  },
});

export const {  setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;

