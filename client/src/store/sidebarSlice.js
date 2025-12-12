import {createSlice} from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        apps:[
            { icon: "Grid3X3" , label: "Dashboard", active: true },
            { icon: "Calendar", label: "Events", active: false },
            { icon: "MessageSquare" , label: "Meetings", active: false },
            { icon: "Clock", label: "Schedule", active: false },
            { icon: "CheckSquare" , label: "Task", active: false },
            { icon: "Phone" , label: "Contacts", active: false },
            { icon: "Mail", label: "Emails", active: false },
            { icon: "FileText" , label: "Accounting", active: false },
            { icon: "FileText", label: "Billings", active: false },
            { icon: "Settings", label: "Settings", active: false },
        ],

        menus:[
          // { label: "Leads", icon: "UserPlus", active: true },
          { label: "Opportunities", icon: "Business", active: false },
          { label: "Customers", icon: "Users", active: false },
          { label: "Employee", icon: "UserPlus", active: false },
          { label: "Reports", icon: "FileChartLine", active: false },
        ]
    },

    
    reducers: {
    addMenu: (state, action) => {
      state.menus.push({
        label: action.payload,
        icon: "File",
        active: false,
      });
    },

    setActiveMenu: (state, action) => {
      state.menus.map((m, i) => {
        m.active = i === action.payload;
      });
      state.apps.map((m) => {
        m.active = false;
      });
    },

    setActiveApps: (state, action) => {
      state.apps.map((m, i) => {
        m.active = i === action.payload;
      });

      // Deactivate menus when an app is activated
      state.menus.map((m) => {
        m.active = false;
      });
    },

  },

});


export const { addMenu, setActiveMenu, setActiveApps } = sidebarSlice.actions;
export default sidebarSlice.reducer;