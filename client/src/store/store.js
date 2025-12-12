import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
  },
});

export default store;