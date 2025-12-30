import {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu, setActiveApps, fetchSidebarMenus } from "../store/sidebarSlice";
import {logout} from '../store/authSlice.js'
import { useNavigate, useLocation  } from "react-router-dom";
import { ConfigProvider, Layout, Menu,  } from "antd";
const { Content, Header, Sider } = Layout;
import getLucideIcon from '../LucideIcons/LucideIcons.jsx';
import RemixIcon from "../assets/Icons/RemixIcon.jsx";


export default function Sidebar({ mode }) {
    const menuItems = useSelector((state) => state.sidebar.menus);
    const {loading, error} = useSelector((state) => state.sidebar);
    const appItems = useSelector((state) => state.sidebar.apps);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [appIndex, setappIndex] = useState(0);
    const [menuIndex, setmenuIndex] = useState(1);
    const [mainMenuOpen, setMainMenuOpen] = useState(false);
    const [currentIndex, setcurrentIndex] = useState("Dashboard")
    const [collapsed, setCollapsed] = useState(false);
    const handleCollapse = () => setCollapsed(!collapsed);
    const isDark = mode === "dark";
    const sidebarBg = isDark ? "#141414" : "#FBFBFB";
    const menuPopupBg = isDark ? "#37353E" : "#FBFBFB";
    const menuTextColor = isDark ? "#FBFBFB" : "#37353E";
    const menuHoverBg = isDark ? "#FBFBFB" : "#37353E";
    const menuHoverColor = isDark ? "#37353E" : "#FBFBFB";
    const triggerBg = isDark ? "#222222" : "#ffffff";
    const triggerColor = isDark ? "#ffffff" : "#000000";



    useEffect(() => {
    dispatch(fetchSidebarMenus());
    }, [dispatch]);
      

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            triggerBg,
            triggerColor,
          },
          Menu: {
            popupBg: menuPopupBg,
            itemColor: menuTextColor,
            itemHoverBg: menuHoverBg,
            itemHoverColor: menuHoverColor,
            itemSelectedBg: "#44444E",
            itemSelectedColor: "#ffffff",
          },
        },
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={180}
        className="pb-40"
        style={{
          background: sidebarBg,
          height: "100vh",
          overflow: "auto",
          scrollbarWidth: "none",
          boxShadow: isDark
            ? "2px 0 6px rgba(0, 0, 0, 0.5)"
            : "2px 0 6px rgba(0, 0, 0, 0.4)",
            borderRight: isDark ? "1px solid #222222" : "1px solid #f0f0f0",
            // zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div className="text-2xl font-bold px-4 py-4">
          {collapsed ? (
            <>
              <span className={isDark ? "text-gray-100" : "text-gray-950"}>R</span>
              <span className="text-orange-500">W</span>
            </>
          ) : (
            <>
              <span className={isDark ? "text-gray-100" : "text-gray-950"}>
                Rabbit
              </span>
              <span className="text-orange-500">Work</span>
            </>
          )}
        </div>

        {/* Main Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={mainMenuOpen ? ["main"] : []}
          onOpenChange={(keys) => setMainMenuOpen(keys.includes("main"))}
          style={{ background: sidebarBg, border: "none" }}
          items={[
            {
              key: "main",
              icon: getLucideIcon("House", { size: 18 }),
              label: "HOME",
              children: menuItems.map((item, index) => ({
                key: item.path,
                icon:
                  item.source === "dynamic"
                    ? <RemixIcon name={item.icon} size={18} margin={8} />
                    : getLucideIcon(item.icon, { size: 18 }),
                label: item.label ?? item.name ?? "No Name",
                onClick: () => {
                  navigate(item.path);
                  setmenuIndex(index + 1);
                  setappIndex(-1);
                  setcurrentIndex(item.label ?? item.name ?? "No Name");
                },
              })),
            },
          ]}
        />

        {/* Apps Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ background: sidebarBg, border: "none" }}
          items={[
            {
              key: "apps",
              type: "group",
              label: (
                <div
                  className="text-gray-500"
                  style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: collapsed ? 24 : 12 }}
                >
                  {getLucideIcon("LibraryBig", { size: 20 })}
                  {!collapsed && <span>Apps</span>}
                </div>
              ),
              children: appItems.map((item, index) => ({
                key: item.path,
                icon: getLucideIcon(item.icon, { size: 18 }),
                label: item.label,
                onClick: () => {
                  navigate(item.path);
                  setmenuIndex(index + 1);
                  setappIndex(-1);
                  setcurrentIndex(item.label);
                },
              })),
            },
          ]}
        />
      </Sider>
    </ConfigProvider>

  );
}