import { use, useState } from "react";
import { User,  Minimize, Moon, Sun, LogOut, Settings, ChevronLeft, Mail, Bell, Search, Maximize, MessageSquareDot } from "lucide-react";
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect } from "react";
import { Badge } from "antd";
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

  const handleHistory = (path) => {
    navigate(path)
  }

  function openFullscreen() {
    let elem = document.documentElement;  
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {  
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {  
      elem.msRequestFullscreen();
    }

    setisFullScreen(true)
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { 
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { 
    document.msExitFullscreen();
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
    // This Regex checks if a segment contains a digit (0-9)
    // If it has a number, we filter it out (removing IDs like 694bc2...)
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
      <div className="flex items-center gap-4">
        <div
         onClick={() => toggleTheme(!isDark)}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
         {isDark === 'dark' ?<Sun size={18} /> : <Moon size={18} />}
        </div>
        <div
        onClick={()=> handleScreenSize()}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
         {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </div>
        <div
          className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-100 rounded-full"
        >
          <Badge count={9} offset={[4, 2]}><Mail size={16} /></Badge>
        </div>
        <div
          className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-100 rounded-full"
        >
         <Badge count={3} offset={[4, 2]}><MessageSquareDot size={16} /></Badge>
        </div>
       <Link to="/account/notifications">
         <div
          className="cursor-pointer h-8 w-8 justify-center items-center flex hover:bg-gray-100 rounded-full"
        >
         <Badge dot> <Bell size={18} /></Badge>
        </div>
       
       </Link>

        <span className={`font-semibold border-l border-gray-300 pl-5 ${mode === "dark" ? "text-gray-300" : "text-slate-600"}`} >{user?.name}</span>
        <div
          onClick={() => setOpen(prev => !prev)}
          className="cursor-pointer p-2 hover:bg-gray-300 bg-gray-200 rounded-full"
        >
         <User size={18} />
        </div>
      </div>

      {/* Popup Side Panel */}
      {open && (
        <div className="absolute right-0 top-14 z-50 w-56 bg-white shadow-xl rounded-lg border p-3 animate-slide">
          <div className="flex items-center justify-between px-2 pb-2 border-b">
            <span className="font-medium">Account</span>
            <ChevronLeft
              size={20}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">

            <button className="text-left px-3 h-8 flex items-center  hover:bg-gray-100 rounded">
              Profile
            </button>

            <button className="text-left px-3 h-8 flex items-center  hover:bg-gray-100 rounded">
              Setting
            </button>
            <Link to={"/account/advance-setting"}>
              <button className="text-left px-3 h-8 flex items-center w-full  hover:bg-gray-100 rounded">
                Advance Setting
              </button>
            </Link>
            <button onClick={() => dispatch(logout())} className=" flex text-red-500 items-center gap-3 text-left px-3 h-8  hover:bg-gray-100 rounded">
             <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
