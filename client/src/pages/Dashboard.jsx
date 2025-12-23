import { React, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ConfigProvider, Layout, Menu } from "antd";
import {
  Calendar,
  House,
  LibraryBig,
  FileChartLine,
  Users,
  BriefcaseBusiness,
  Settings,
  MessageSquare,
  LayoutGrid,
  Clock,
  CheckSquare,
  Phone,
  Mail,
  FileText,
  LogOut,
  Grid3X3,
  ChevronDown,
  ChevronsLeft,
  LayoutList,
  UserRoundPlus,
  CreditCard,
  Package,
  Target,
  FilePlusCorner,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import CustomerDashboard from "../components/Menu/Customer";
import { useNavigate } from "react-router-dom";

const { Content, Header, Sider } = Layout;

const Dashboard = () => {
  const menuItems = useSelector((state) => state.sidebar.menus);
  const appItems = useSelector((state) => state.sidebar.apps);
  const navigate = useNavigate();
  const [appIndex, setappIndex] = useState(0);
  const [menuIndex, setmenuIndex] = useState(1);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [currentIndex, setcurrentIndex] = useState("Dashboard")

  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = () => setCollapsed(!collapsed);

  const Icons = {
    Grid3X3: <Grid3X3 size={18} />,
    LibraryBig: <LibraryBig size={18} />,
    Calendar: <Calendar size={18} />,
    MessageSquare: <MessageSquare size={18} />,
    Clock: <Clock size={18} />,
    CheckSquare: <CheckSquare size={18} />,
    Phone: <Phone size={18} />,
    Mail: <Mail size={18} />,
    FileText: <FileText size={18} />,
    Settings: <Settings size={18} />,
    UserPlus: <UserRoundPlus size={18} />,
    Business: <BriefcaseBusiness size={18} />,
    Users: <Users size={18} />,
    FileChartLine: <FileChartLine size={18} />,
    House: <House size={18} />,
    CreditCard: <CreditCard size={18} />,
    Package: <Package size={18} />,
    Target: <Target size={18} />,
    FilePlusCorner:<FilePlusCorner size={18} />
  };


  return (
    <div>
      Dashboard
    </div>
  );
};

export default Dashboard;
