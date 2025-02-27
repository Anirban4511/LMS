import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};
// userLoggedIn({name:"anirban"})
const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducer: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated=true
    },
    userLoggedOut:(state)=>{
      state.user=null
      state.isAuthenticated=false
    }
  },
});

export const {userLoggedIn,userLoggedOut}=authSlice.actions;
export default authSlice.reducer