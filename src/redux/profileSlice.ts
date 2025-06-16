// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UserProfile {
//   id: number;
//   name: string;
//   email: string;
//   image?: string;
//   [key: string]: any;
// }

// interface ProfileState {
//   user: UserProfile | null;
// }

// const initialState: ProfileState = {
//   user: null,
// };

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<UserProfile>) => {
//       state.user = action.payload;
//     },
//   },
// });

// export const { setUser } = profileSlice.actions;
// export default profileSlice.reducer;
// redux/profileSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
