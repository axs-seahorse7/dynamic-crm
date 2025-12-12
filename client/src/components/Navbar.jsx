import { useState } from "react";
import { User, Minimize, LogOut, Settings, ChevronLeft, Mail, Bell, Search, Maximize, MessageSquareDot } from "lucide-react";
import {Link} from 'react-router-dom'
import {useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useEffect } from "react";

export default function Navbar() {
const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const pathName = window.location.pathname;
  const [isFullScreen, setisFullScreen] = useState(false)
  const handleScreenSize = () => setisFullScreen(!isFullScreen)

  
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
    <div className="w-full relative bg-white shadow h-10 flex items-center justify-between px-6 ">

      {/* Logo */}
      <div className="text-md tracking-wider text-gray-600  border border-gray-300 rounded px-2 w-[20vw] flex justify-between items-center gap-2">
        <input type="text" placeholder="search..." className=" w-[16vw] bg-white shadow outline-none text-sm py-0.5 " /> <Search size={16} />
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
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
          <Mail size={16} />
        </div>
        <div
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
         <MessageSquareDot size={16} />
        </div>
       <Link to="/account/notifications">
         <div
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell size={16} />
        </div>
       
       </Link>
        {/* User Icon */}
        <div
          onClick={() => setOpen(prev => !prev)}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
          <User size={16} />
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

          <div className="mt-2 flex flex-col">
            <button className="text-left px-3 py-2 hover:bg-gray-100 rounded">
              Profile
            </button>

            <button className="text-left px-3 py-2 hover:bg-gray-100 rounded">
              Setting
            </button>
            <Link to={"/account/advance-setting"}>
            <button className="text-left px-3 py-2 hover:bg-gray-100 rounded">
              Advance Setting
            </button>
            </Link>
            <button onClick={() => dispatch(logout())} className=" flex items-center gap-3 text-left px-3 py-2 hover:bg-gray-100 rounded">
             <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
