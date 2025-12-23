import {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu, setActiveApps, fetchSidebarMenus } from "../store/sidebarSlice";
import {logout} from '../store/authSlice.js'
import { useNavigate, useLocation  } from "react-router-dom";
import { ConfigProvider, Layout, Menu } from "antd";
const { Content, Header, Sider } = Layout;
import getLucideIcon from '../LucideIcons/LucideIcons.jsx';
import RemixIcon from "../assets/Icons/RemixIcon.jsx";

// import {
//   Calendar,
//   House,
//   LibraryBig,
//   FileChartLine,
//   Users,
//   BriefcaseBusiness,
//   Settings,
//   MessageSquare,
//   LayoutGrid,
//   Clock,
//   CheckSquare,
//   Phone,
//   Mail,
//   FileText,
//   LogOut,
//   Grid3X3,
//   ChevronDown,
//   ChevronsLeft,
//   LayoutList,
//   UserRoundPlus,
//   CreditCard,
//   Package,
//   Target,
//   FilePlusCorner,
// } from "lucide-react";


export default function Sidebar() {
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

    //  const Icons = {
    //     Grid3X3: <Grid3X3 size={18} />,
    //     LibraryBig: <LibraryBig size={18} />,
    //     Calendar: <Calendar size={18} />,
    //     MessageSquare: <MessageSquare size={18} />,
    //     Clock: <Clock size={18} />,
    //     CheckSquare: <CheckSquare size={18} />,
    //     Phone: <Phone size={18} />,
    //     Mail: <Mail size={18} />,
    //     FileText: <FileText size={18} />,
    //     Settings: <Settings size={18} />,
    //     UserPlus: <UserRoundPlus size={18} />,
    //     Business: <BriefcaseBusiness size={18} />,
    //     Users: <Users size={18} />,
    //     FileChartLine: <FileChartLine size={18} />,
    //     House: <House size={18} />,
    //     CreditCard: <CreditCard size={18} />,
    //     Package: <Package size={18} />,
    //     Target: <Target size={18} />,
    //     FilePlusCorner:<FilePlusCorner size={18} />
    //   };

    useEffect(() => {
        if (currentIndex == "New Menu") {
          return navigate("/account/create/form");
        }
      }, [currentIndex]);

    useEffect(() => {
      dispatch(fetchSidebarMenus());
      }, [dispatch]);
      
      // console.log("Sidebar menus:", menuItems, loading, error);

  return (
       <Sider
         collapsible
         collapsed={collapsed}
         onCollapse={handleCollapse}
         width={200}
         style={{
           background: "#001529",
           overflow: "auto",
           height: "100vh",
           paddingBottom:"40px",
           scrollbarWidth: "none",
           borderRight: "1px solid white",
         }}
         className="pb-40"
       >
         {/*<<--------------------------  Menu items -------------------->> */}
         <ConfigProvider
           theme={{
             components: {
               Menu: {
                 itemColor: "#ffffff",
                 itemHoverColor: "#1890ff",
                 itemHoverBg: "#ffffff",
                 itemSelectedColor: "#ffffff",
                 itemSelectedBg: "#1890ff",
                 popupBg: "#001529",
               },
             },
           }}
         >
           <Menu
             mode="inline"
             selectedKeys={[location.pathname]}
             openKeys={mainMenuOpen ? ["main"] : []}
             onOpenChange={(keys) => {
               setMainMenuOpen(keys.includes("main"));
             }}
             style={{ background: "#001529", paddingTop: "64px", }}
            items={[
              {
                key: "main",
                icon: getLucideIcon("House", { size: 18 }),
                label: "Menu",
                children: menuItems.map((item, index) => ({
                  key: item.path,
                  icon: item.source === "dynamic" ? (<RemixIcon name={item.icon} size={18} margin={8} />) : getLucideIcon(item.icon, { size: 18 }) ,
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
         </ConfigProvider>
 
         {/*<<-------------------------- App menu items -------------------->> */}
         <ConfigProvider
           theme={{
             components: {
               Menu: {
                 itemColor: "#ffffff",
                 itemHoverColor: "#1890ff",
                 itemHoverBg: "#ffffff",
                 itemSelectedColor: "#ffffff",
                 itemSelectedBg: "#1890ff",
               },
             },
           }}
         >
           <Menu
             mode="inline"
             selectedKeys={[location.pathname]}
             onClick={(e) => {
               setappIndex(parseInt(e.key));
               setmenuIndex(-1);
             }}
             items={[
               {
                 key: "main",
                 type: "group",
                 label: (
                   <div
                     className="text-gray-500 px-4 "
                     style={{
                       display: "flex",
                       alignItems: "center",
                       gap: collapsed ? 0 : "5px",
                       fontSize: "14px",
                       fontWeight: "500",
                     }}
                   >
                    { getLucideIcon("LibraryBig", { size: 18 })}
                     <span style={{ marginLeft: 8 }}>Apps</span>
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
             style={{ 
              background: "#001529", 
              paddingTop: "14px", 
              paddingBottom: "60px",
            }}
           />
         </ConfigProvider>
       </Sider>
  );
}