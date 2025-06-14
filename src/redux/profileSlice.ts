import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  image?: string;
  [key: string]: any;
}

interface ProfileState {
  user: UserProfile | null;
}

const initialState: ProfileState = {
  user: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
