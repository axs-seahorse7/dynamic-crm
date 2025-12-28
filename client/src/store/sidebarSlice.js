import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ------------------ STATIC MENUS ------------------ */
const staticMenus = [
  { id: "dashboard", label: "Dashboard",  icon: "Grid3X3", path: "/dashboard",  active: true },
  { id: "leads", label: "Leads", icon: "Target", path: "/dashboard/leads", active: false },
  { id: "customers", label: "Customers", path: "/dashboard/customers", icon: "Users", active: false },
  { id: "reports", label: "Reports", path: "/dashboard/reports", icon: "FileChartLine", active: false },
];

const url = import.meta.env.VITE_API_URI; 

/* ------------------ FETCH DYNAMIC MENUS ------------------ */
export const fetchSidebarMenus = createAsyncThunk(
  "sidebar/fetchMenus",
  async (_, { rejectWithValue }) => { 
    try {
      const res = await axios.get(url+"/sidebar/menus");
      console.log(res.data);
      return res.data;
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
      { icon: "Calendar", label: "Events", path: "/dashboard/events", active: false },
      { icon: "MessageSquare", label: "Meetings", path: "/dashboard/meetings", active: false },
      { icon: "Clock", label: "Schedule", path: "/dashboard/schedule", active: false },
      { icon: "CheckSquare", label: "Task", path: "/dashboard/tasks", active: false },
      { icon: "Phone", label: "Contacts", path: "/dashboard/contacts", active: false },
      { icon: "Mail", label: "Emails", path: "/dashboard/emails", active: false },
      { icon: "ListPlus", label: "New Menu", path: "/dashboard/create/form", active: false },
      { icon: "Settings", label: "Settings", path: "/dashboard/settings",  active: false }

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


        const dynamicMenus = menusArray.map((form) => ({
          id: form._id,              // ✅ REQUIRED
          label: form.name || "Untitled Form",
          icon: form.icon ?? "FileText",
          path: form.path || "/*",
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
