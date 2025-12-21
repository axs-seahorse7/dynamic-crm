import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ------------------ STATIC MENUS ------------------ */
const staticMenus = [
  { id: "dashboard", label: "Dashboard", icon: "Grid3X3", active: true },
  { id: "leads", label: "Leads", icon: "Target", active: false },
  { id: "customers", label: "Customers", icon: "Users", active: false },
  { id: "reports", label: "Reports", icon: "FileChartLine", active: false },
  { id: "settings", label: "Settings", icon: "Settings", active: false }
];

const url = import.meta.env.VITE_API_URI; 

/* ------------------ FETCH DYNAMIC MENUS ------------------ */
export const fetchSidebarMenus = createAsyncThunk(
  "sidebar/fetchMenus",
  async (_, { rejectWithValue }) => { 
    try {
      const res = await axios.get(url+"/sidebar/menus");
      // console.log(res.data);
      return res.data; // array of menus
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load sidebar menus"
      );
    }
  }
);

/* ------------------ SLICE ------------------ */
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    loading: false,
    error: null,

    menus: staticMenus.map(m => ({
      ...m,
      source: "static"
    })),

    apps: [
      { icon: "Calendar", label: "Events", active: false },
      { icon: "MessageSquare", label: "Meetings", active: false },
      { icon: "Clock", label: "Schedule", active: false },
      { icon: "CheckSquare", label: "Task", active: false },
      { icon: "Phone", label: "Contacts", active: false },
      { icon: "Mail", label: "Emails", active: false }
    ]
  },

  reducers: {
    setActiveMenu: (state, action) => {
      state.menus.forEach((menu, i) => {
        menu.active = i === action.payload;
      });

      state.apps.forEach(app => {
        app.active = false;
      });
    },

    setActiveApps: (state, action) => {
      state.apps.forEach((app, i) => {
        app.active = i === action.payload;
      });

      state.menus.forEach(menu => {
        menu.active = false;
      });
    }
  },

  extraReducers: builder => {
    builder
      .addCase(fetchSidebarMenus.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSidebarMenus.fulfilled, (state, action) => {
        state.loading = false;

         const menusArray = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.forms || [];


        const dynamicMenus = menusArray.map(m => ({
          ...m,
          active: false,
          source: "dynamic"
        }));

        const merged = [...state.menus, ...dynamicMenus].reduce(
          (acc, menu) => {
            acc[menu.id] = acc[menu.id] || menu;
            return acc;
          },
          {}
        );

        state.menus = Object.values(merged);
      })

      .addCase(fetchSidebarMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setActiveMenu, setActiveApps } = sidebarSlice.actions;
export default sidebarSlice.reducer;
