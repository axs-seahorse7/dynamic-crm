import {createSlice} from '@reduxjs/toolkit';
import { setActiveMenu } from '../../../../store/sidebarSlice';

const Menus = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Grid3X3', path: '/dashboard', active: true },
  { id: 'users', label: 'Users', icon: 'Users', path: '/dashboard/users', active: false },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/dashboard/settings', active: false },
];

const sidebarSlice = createSlice({
  name: 'AdminSidebar',
  initialState: {
    loading: false,
    error: null,
    menus: Menus
    },
    reducers: {
    setActiveMenu: (state, action) => {
    state.menus.forEach((menu, i) => {
        menu.active = i === action.payload;
    });
    }
  },
});

export const { setActiveMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;