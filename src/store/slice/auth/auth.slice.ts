import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState } from "./auth.type";

const initialState: AuthState = {
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state: AuthState,
      action: PayloadAction<Readonly<AuthState>>
    ) => {
      state.user = action.payload.user;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
