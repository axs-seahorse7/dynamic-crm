import React from 'react';
import { Layout, Menu } from 'antd';
import {

HomeOutlined,
UserOutlined,
SettingOutlined,
LogoutOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
const menuItems = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: 'Dashboard',
    },
    {
        key: '2',
        icon: <UserOutlined />,
        label: 'Users',
    },
    {
        key: '3',
        icon: <SettingOutlined />,
        label: 'Settings',
    },
    {
        key: '4',
        icon: <LogoutOutlined />,
        label: 'Logout',
        style: { marginLeft: 'auto' },
    },
];

return (
    <Header style={{ display: 'flex', alignItems: 'center', height: '64px' }}>
        <div style={{ color: 'white', fontSize: '20px', marginRight: '40px' }}>
            Admin Panel
        </div>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={menuItems}
            style={{ flex: 1, minWidth: 0 }}
        />
    </Header>
);
};

export default Navbar;