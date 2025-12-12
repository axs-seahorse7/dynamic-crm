
import {useState} from "react"
import { Calendar, FileChartLine, Users, BriefcaseBusiness, Settings, MessageSquare, LayoutGrid, Clock, CheckSquare, Phone, Mail, FileText, LogOut, Grid3X3, ChevronDown, ChevronsLeft , LayoutList, UserRoundPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu, setActiveApps } from "../store/sidebarSlice";
import {logout} from '../store/authSlice.js'
import { useNavigate } from "react-router-dom";


export default function Sidebar() {
    const menuItems = useSelector((state) => state.sidebar.menus);
    const appItems = useSelector((state) => state.sidebar.apps);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarShrunk, setisSidebarShrunk] = useState(false)
    const handleToogleSidebar = () => setisSidebarShrunk(!isSidebarShrunk)
    const [isMenu, setisMenu] = useState(false)
    const handleToogleMenu = () => setisMenu(!isMenu)

    const Icons = {
        Grid3X3: <Grid3X3 size={18} />,
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
    }

     function handleLogout() {
      dispatch(logout());
      navigate('/login');
    }

    

  return (
    <div
      className={` relative shadow shadow-gray-500 h-screen overflow-y-scroll overflow-auto bg-white text-[#001233] flex flex-col gap-4 pb-4 transition-all duration-200 ${
        isSidebarShrunk ? 'w-14 px-1' : 'w-40 px-2'
      }`}
      style={{scrollbarWidth: "thin" }}
    >
      <div className={`px-2 flex items-center justify-between gap-1 py-4 border-b border-gray-300 ${isSidebarShrunk ? 'justify-center' : ''}`}>
        {!isSidebarShrunk && <img src="./images/zentro.png" alt="" style={{ height: "40px", width: "80px" }} />}
        <button
          onClick={handleToogleSidebar}
          className="h-8 w-8 hover:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ChevronsLeft className={`${isSidebarShrunk ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>

      
      <div className="space-y-1 flex-1">

        {appItems.map((item, i) => (
          item.label === "Dashboard" && (<div
            key={item.label}
            onClick={() => dispatch(setActiveApps(i))}
            className={`flex items-center ${isSidebarShrunk ? 'justify-center gap-0 px-2' : 'gap-2 px-4'} py-1.5 cursor-pointer hover:bg-[#00224f]  rounded transition-all ${
              item.active ? "bg-gray-200 text-[#001233] hover:text-[#001233] hover:bg-gray-300 shadow " : "hover:text-white"
            }`}
          >
            {Icons[item.icon]}
            {!isSidebarShrunk && <span className="text-[12px] tracking-wider" style={{fontFamily:'sans-serif'}}>{item.label}</span>}
          </div>)
        ))}


        <div onClick={handleToogleMenu} className={`text-sm text-gray-500 mt-3 ${isSidebarShrunk ? 'px-2 justify-center' : 'px-4 justify-between'} py-1 cursor-pointer hover:bg-gray-200 rounded-md flex items-center`}>
          <LayoutList size={16} /> {!isSidebarShrunk && <span>Menu</span>}
          {isMenu ? !isSidebarShrunk && <ChevronDown size={14} className="transform rotate-180 transition-transform"/> : !isSidebarShrunk && <ChevronDown size={14} className="transition-transform"/>}
        </div>

          <div className={`overflow-hidden flex flex-col gap-1 transition-[max-height] duration-300 ease-in-out ${isMenu ? 'max-h-96' : 'max-h-0'}`}>
          {isMenu && menuItems.map((item, i) => (
              <div
                key={item.label}
                onClick={() => dispatch(setActiveMenu(i))}
                className={`flex items-center ${isSidebarShrunk ? 'justify-center gap-0 px-2' : 'gap-2 px-4'} py-1.5 cursor-pointer hover:bg-[#00224f] rounded transition-all ${
                  item.active ? "bg-gray-200 text-[#001233] hover:text-[#001233] hover:bg-gray-300 shadow " : "hover:text-white"
                }`}
              >
                {Icons[item.icon]}
                {!isSidebarShrunk && <span className="text-[12px] tracking-wider" style={{fontFamily:'sans-serif'}}>{item.label}</span>}
              </div>
            
          ))}
          </div>

        
        <div  className={`text-sm text-gray-500 mb-3 ${isSidebarShrunk ? 'px-2 justify-center' : 'px-4 gap-4'} py-1 cursor-pointer hover:bg-gray-200 rounded-md flex items-center`}>
          <LayoutGrid size={16} /> {!isSidebarShrunk && <span>Apps</span>}
        </div>

        <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out `}>
          {appItems.map((item, i) => (
            item.label !== "Dashboard" && (
              <div
                key={item.label}
                onClick={() => dispatch(setActiveApps(i))}
                className={`flex items-center ${isSidebarShrunk ? 'justify-center gap-0 px-2' : 'gap-2 px-4'} py-1.5 cursor-pointer hover:bg-[#00224f] rounded transition-all ${
                  item.active ? "bg-gray-200 text-[#001233] hover:text-[#001233] hover:bg-gray-300 shadow " : "hover:text-white"
                }`}
              >
                {Icons[item.icon]}
                {!isSidebarShrunk && <span className="text-[12px] tracking-wider" style={{fontFamily:'sans-serif'}}>{item.label}</span>}
              </div>
            )
          ))}
        </div>
      </div>

      

      {/* <div onClick={() => handleLogout()} className=" absolute bg-white w-full bottom-0 left-0 border-t border-gray-700 py-4 px-4 flex items-center gap-3 cursor-pointer hover:bg-[#00224f] hover:text-white transition-all">
        <LogOut size={18} />
       {isSidebarShrunk
        ? null
        : <span className="text-sm">Log out</span>}
      </div> */}
    </div>
  );
}