import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import authReducer from "./authSlice";
import superAdminAuthReducer from "./superAdminAuthSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    superAdminAuth: superAdminAuthReducer,

  },
});

export default store;