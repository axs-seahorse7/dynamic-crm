import { useState } from "react";
import { User, Settings, ChevronLeft } from "lucide-react";
import {Link} from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-white shadow h-10 flex items-center justify-between px-6 ">

      {/* Logo */}
      <div className="text-md tracking-wider font-semibold text-cyan-600 ">Dynamic-CRM</div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* User Icon */}
        <div
          onClick={() => setOpen(prev => !prev)}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
        >
          <User size={22} />
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
            <Link to={"/advance-setting"}>
            <button className="text-left px-3 py-2 hover:bg-gray-100 rounded">
              Advance Setting
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
