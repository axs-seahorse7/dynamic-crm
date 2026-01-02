import React from 'react'
import { Outlet } from 'react-router-dom'
import {Layout} from 'antd'
import Sidebar from '../Super-Admin/components/Sidebar/Sidebar.jsx'
import Navbar from '../Super-Admin/components/Navbar-Admin/Navbar.jsx'
const { Header, Sider, Content } = Layout

 const AdminLayout = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Navbar />
        <Content style={{  overflow: 'initial' }}>
          <div style={{padding:"10px", textAlign: 'center', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

    </Layout>
  )
}

export default AdminLayout
