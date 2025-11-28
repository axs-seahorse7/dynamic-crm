import {createSlice} from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        menus:[
            { icon: "Grid3X3" , label: "Dashboard", active: true },
            { icon: "Calendar", label: "Events", active: false },
            { icon: "MessageSquare" , label: "Meetings", active: false },
            { icon: "Clock", label: "Schedule", active: false },
            { icon: "CheckSquare" , label: "Task", active: false },
            { icon: "Phone" , label: "Contacts", active: false },
            { icon: "Mail", label: "Emails", active: false },
            { icon: "FileText" , label: "Accounting", active: false },
            { icon: "FileText", label: "Billings", active: false },
        ]
    },

    
    reducers: {
    addMenu: (state, action) => {
      state.menus.push({
        label: action.payload,
        icon: "file",
        active: false,
      });
    },

    setActiveMenu: (state, action) => {
      state.menus.map((m, i) => {
        m.active = i === action.payload;
      });
    },
  },

});


export const { addMenu, setActiveMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;