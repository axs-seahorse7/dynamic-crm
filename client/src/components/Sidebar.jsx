import { useState } from "react";
import { Calendar, MessageSquare, Clock, CheckSquare, Phone, Mail, FileText, LogOut, Grid3X3 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveMenu } from "../store/sidebarSlice";



export default function Sidebar() {
    const menuItems = useSelector((state) => state.sidebar.menus);
    const dispatch = useDispatch();

    const Icons = {
        Grid3X3: <Grid3X3 size={18} />,
        Calendar: <Calendar size={18} />,
        MessageSquare: <MessageSquare size={18} />,
        Clock: <Clock size={18} />,
        CheckSquare: <CheckSquare size={18} />,
        Phone: <Phone size={18} />,
        Mail: <Mail size={18} />,
        FileText: <FileText size={18} />
    }
    

  return (
    <div className=" sidebarHeight absolute left-0 top-10 w-40 overflow-y-scroll bg-[#001233] text-white flex flex-col justify-between" style={{scrollbarWidth:"none"}}>

      <div>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            onClick={() => dispatch(setActiveMenu(i))}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#00224f] transition-all ${
              item.active ? "bg-white text-[#001233] font-semibold hover:text-white" : ""
            }`}
          >
            {Icons[item.icon]}
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 py-4 px-4 flex items-center gap-3 cursor-pointer hover:bg-[#00224f] transition-all">
        <LogOut size={18} />
        <span className="text-sm">Log out</span>
      </div>
    </div>
  );
}