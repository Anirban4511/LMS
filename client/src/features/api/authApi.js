import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8000/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),

    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.user)); // ✅ Fix: Send 'data.user' directly
        } catch (error) {
          console.log(error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (inputData) => ({
        url: "forgot-password",
        method: "POST",
        body: inputData,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `reset-password`,
        method: "POST",
        body: { token, newPassword },
      }),
    }),

    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn(data.user)); // ✅ Fix: Update Redux state when user loads
        } catch (error) {
          console.log("User not logged in");
          dispatch(userLoggedOut());
        }
      },
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut()); // ✅ Fix: Ensure Redux state resets on logout
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
