import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",  // Keep a simple name
  initialState,
  reducers: {   // ✅ Fix: Use 'reducers' instead of 'reducer'
    userLoggedIn: (state, action) => {
      state.user = action.payload;  // ✅ Fix: Store 'action.payload' directly
      state.isAuthenticated = true;
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
