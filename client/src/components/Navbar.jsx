import { use, useState } from "react";
import { User,  Minimize, Moon, Sun, LogOut, Settings, ChevronLeft, Mail, Bell, Search, Maximize, MessageSquareDot } from "lucide-react";
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect } from "react";
import { Badge, Card } from "antd";
import Button from "./Buttons/Buttons.jsx";


export default function Navbar({ toggleTheme, mode }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isFullScreen, setisFullScreen] = useState(false)
  const handleScreenSize = () => setisFullScreen(!isFullScreen)
  const user = JSON.parse(localStorage.getItem('user'))
  const [pathName, setPathName] = useState(window.location.pathname)
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // console.log("user from nav ",user)
  const StyleSheet = {
  box: {background : mode === "dark"? "#141414": "#FBFBFB"},
    element: {color : mode === "dark"? "#FBFBFB": "#141414", hoverBg: mode === "dark"? "#1F1F1F": "#E5E5E5", display:"flex", alignItems:"center", height:"32px", width:"100%", borderRadius:"9999px", cursor:"pointer", padding:"12px"}
  }

  const handleHistory = (path) => {
    navigate(path)
  }

  async function openFullscreen() {
  let elem = document.documentElement;  
  
  if (elem.requestFullscreen) {
  await elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {  
  await elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {  
  await elem.msRequestFullscreen();
  }
  setisFullScreen(true)
}

  async function closeFullscreen() {
  if (document.exitFullscreen) {
  await document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { 
  await  document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { 
  await document.msExitFullscreen();
  }
}

useEffect(() => {
  document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
  setisFullScreen(false);
  }
  });
}, []);

useEffect(() => {
  if(isFullScreen){
  openFullscreen()
    }

  if(!isFullScreen){
  closeFullscreen()
    }

}, [isFullScreen]);

useEffect(() => {
setPathName(location.pathname);
}, [location.pathname]);


const formatPathname = (path) => {
  if (!path || path === "/") return "Dashboard";

  return path
    .split("/")
    .filter(Boolean) 
    .filter(segment => !/\d/.test(segment)) 
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" / ");
};

const isDark = mode === "dark";

useEffect(() => {
  if(isDarkMode){
    mode = "dark"
  } else {
    mode = "light"
  }
}, [isDarkMode]);


  return (
    <div className="w-full relative shadow-md select-none h-full flex items-center justify-between px-6 " style={{background : mode === "dark"? "#141414": "#FBFBFB"}}>

      <div className="flex gap-5 items-center">
        
       {location.pathname !== "/dashboard" && <button onClick={() => handleHistory(-1)} className="px-4 py-1 rounded-full flex items-center justify-center text-2xl cursor-pointer "><i class="ri-arrow-left-long-line hover:translate-x-[-5px] "></i></button>}
        <span className={`text-md ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}> {formatPathname(pathName)} </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4" >
        <div
         onClick={() => toggleTheme(!isDark)}
          className="cursor-pointer p-2 hover:bg-gray-500 rounded-full"
          
        >
         {mode === 'dark' ?<Sun size={18} /> : <Moon size={18} />}
        </div>
        <div
        onClick={()=> handleScreenSize()}
          className="cursor-pointer p-2 hover:bg-gray-500 rounded-full"
          
        >
         {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </div>
        <div
          className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-500 rounded-full"
        >
          <Badge 
          style={{
          fontSize: 10,
          height: 16,
          minWidth: 16,
          lineHeight: "16px",
        }} 
        count={9} offset={[4, 2]}><Mail size={16} /></Badge>
        </div>
         <div
          className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-500 rounded-full"
        >
         <Badge 
         style={{
          fontSize: 10,
          height: 16,
          minWidth: 16,
          lineHeight: "16px",
        }} 
        count={3} offset={[4, 2]}><MessageSquareDot size={16} /></Badge>
        </div>
       
         <div className="pl-5 flex gap-5 border-l">
          <Link to="/account/notifications">
            <div
              className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-500 rounded-full"
            >
            <Badge dot> <Bell size={18} /></Badge>
            </div>
          </Link>

          <div
            onClick={() => setOpen(prev => !prev)}
            className="cursor-pointer p-2 hover:bg-gray-300 bg-gray-200 rounded-full"
            >
          <User size={18} />
          </div>
        </div>
      </div>

      {/* Popup Side Panel */}
      {open && (
        <div style={{background : mode === "dark"? "#141414": "#FBFBFB"}} className="absolute right-0 top-16 z-50 w-56 bg-white shadow-xl rounded-lg border border-gray-300 p-3 animate-slide">
        
          <div className="flex items-center justify-between pb-2">
           <Card style={{width:"100%"}}>
             <section style={{display:"flex", width:"100%", gap:"12px", alignItems:"center",}}>
               <div
                onClick={() => setOpen(prev => !prev)}
                className="cursor-pointer h-14 w-14 flex items-center justify-center hover:bg-gray-300 bg-gray-200 rounded-full"
                >
              <User size={18} />
              </div>

              <div>
               <div className="text-xl">{user?.name}</div>
              <div>{user?.roleId.name}</div>
             </div>
             
             </section>
           </Card>
          </div>

            <Card>

          <div className=" flex flex-col gap-2">

            <button style={StyleSheet.element}>
              Profile
            </button>

            <button style={StyleSheet.element}>
              Setting
            </button>
            <Link to={"/account/advance-setting"}>
             {user.roleId.name === "admin" && <button style={StyleSheet.element}>
                Advance Setting
              </button>}
            </Link>
            <button onClick={() => dispatch(logout())} style={{...StyleSheet.element, color: "red", gap: "12px"}} >
             <LogOut size={16} /> Log out
            </button>
          </div>
        </Card>

        </div>
      )}
    </div>
  );
}


