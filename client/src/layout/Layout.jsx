import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Layout from "antd/es/layout/layout";
const { Content, Header, Sider } = Layout;


const Layouts = () => {
  return (
    <Layout style={{ minHeight: "100vh", }}>
      <Sidebar />

      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <Navbar />
        </Header>
        <Content>
          <div className="bg-gray-200 h-[90vh] w-4/4 py-5 px-5 overflow-y-auto shadow" style={{scrollbarWidth:"thin"}}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
