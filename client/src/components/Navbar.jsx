import { useState } from "react";
import { User,  Minimize, LogOut, Settings, ChevronLeft, Mail, Bell, Search, Maximize, MessageSquareDot } from "lucide-react";
import {Link} from 'react-router-dom'
import {useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect } from "react";
import { Badge } from "antd";

export default function Navbar() {
const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const pathName = window.location.pathname;
  const [isFullScreen, setisFullScreen] = useState(false)
  const handleScreenSize = () => setisFullScreen(!isFullScreen)
  const user = JSON.parse(localStorage.getItem('user'))

  
  function openFullscreen() {
    let elem = document.documentElement; // fullscreen the whole page
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { // Safari
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge old
      elem.msRequestFullscreen();
    }

    setisFullScreen(true)
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { // Safari
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge old
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

  // if(document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen){
  //   setisFullScreen(false)
  // }

}, [isFullScreen]);

  return (
    <div className="w-full relative bg-white shadow h-full flex items-center justify-between px-6 ">

      {/* Logo */}
      <div className="text-md tracking-wider text-gray-600  border border-gray-300 rounded-full px-3 w-[20vw] overflow-hidden flex justify-between items-center gap-1">
      <Search size={16} />  <input type="text" placeholder="search..." className=" w-[16vw] bg-white outline-none text-sm py-1 " /> 
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
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

        <span className="font-semibold text-slate-600 border-l border-gray-300 pl-2">{user?.name}</span>
        <div
          onClick={() => setOpen(prev => !prev)}
          className="cursor-pointer p-2 hover:bg-gray-300 bg-gray-200 rounded-full"
        >
         <User size={18} />
        </div>
      </div>

      {/* Popup Side Panel */}
      {open && (
        <div className="absolute right-0 top-14 w-56 bg-white shadow-xl rounded-lg border p-3 animate-slide">
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
