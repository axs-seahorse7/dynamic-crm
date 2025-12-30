import React, { useState } from 'react'
import {Layout, Menu} from "antd"
const { Sider } = Layout
import { DashboardOutlined, UserOutlined, UserAddOutlined, UsergroupAddOutlined, UserSwitchOutlined, BankOutlined } from '@ant-design/icons';
import { LayoutDashboard, Users, UserPlus, UserCog, Landmark } from 'lucide-react';
import {useNavigate} from 'react-router-dom'


const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState('Dashboard')
  const navigate = useNavigate()


  const items = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard', active: false },
  { label: 'Registered Client', icon: <Users size={18} />, path: '/admin/registered-client', active: false },
  { label: 'Create Client', icon: <UserPlus size={18} />, path: '/admin/create-client', active: false },
  { label: 'Manage Client', icon: <UserCog size={18} />, path: '/admin/manage-client', active: false },
  { label: 'Create Company', icon:<Landmark size={18} />, path: '/admin/create/company', active: false }
  ]

  return (

       <Sider
        collapsible
        collapsed={open}
        onCollapse={() => setOpen(!open)}
        width={220}
        className="h-screen shadow-lg bg-white"
        style={{scrollbarWidth:'none'}}
       >
        <Menu
          mode="inline"
          selectedKeys={[active]}
          onClick={({ key }) => {
            setActive(key)
            const item = items.find(item => item.label === key)
            if (item) {
              navigate(item.path)
            }
          }}
          items={items.map(item => ({
            key: item.label,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>

  )
}

export default Sidebar