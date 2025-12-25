import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Layout from "antd/es/layout/layout";
const { Content, Header, Sider } = Layout;

const { darkAlgorithm, defaultAlgorithm } = theme;



const Layouts = ({ mode, toggleTheme }) => {
  // const [mode, setMode] = useState("light");

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? darkAlgorithm : defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorPrimary: "#1890ff",
        },
      }}
    >
      {/* Pass theme control down */}
      <Layout mode={mode} toggleTheme={toggleTheme}>
    <Layout style={{ minHeight: "100vh", border: "none" }} >
      <Sidebar mode={mode} />

    <div style={{ background: "white",  overflow: "hidden", width: "100%", }} >
        <Layout >
        <Header style={{ padding: 0 }}>
          <Navbar mode={mode} toggleTheme={toggleTheme} />
        </Header>
        <Content style={{background: mode === "dark" ? "#141414" :  "white"}} >
          <div className={`${mode === "dark" ? "bg-gray-800" : "bg-gray-200 "} h-[90vh] px-3 rounded-tl-2xl   py-3 w-full overflow-y-auto shadow`} style={{scrollbarWidth:"thin"}}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </div>
    </Layout>
    </Layout>
    </ConfigProvider>
  );
};

export default Layouts;
