import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const token = localStorage.getItem("superAdminToken");
const initialState = {
  isAuthenticated: token ? true : false,
  admin: null,
  token: token ?? null,
};


const superAdminAuthSlice = createSlice({
  name: "superAdminAuth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = superAdminAuthSlice.actions;
export default superAdminAuthSlice.reducer;
