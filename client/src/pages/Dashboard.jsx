import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { House } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <div>
        <Sidebar />
      </div>
      <div className=" flex-1 relative w-full">
        <Navbar />
        <div className=" w-full h-15 flex items-center justify-between px-6 mt-4 ">
          <div className="flex flex-col">
            <span className="text-2xl font-bold"> Admin pannel</span>
            <div className="text-gray-500 text-sm flex items-center ">
              <House size={16} />/ Dashboard
            </div>
          </div>
          <div className="flex gap-4">
            <button className="button">Export</button>
            <input
              type="date"
              className="button"
              value={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className=" w-full px-4">
          <div className="bg-white px-6 w-full h-20 shadow rounded-md flex items-center justify-between mt-4">
           
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border rounded-full"></div>
              <div>
                <span className="text-lg font-bold text-slate-700 ">Welcome, John Advin</span>
                <div className="text-sm text-gray-500">Administrator</div>
              </div>
            </div>

            <button className="selectedButton">
              View Profile
            </button>
          </div>

          <div>
            {/* Other dashboard content can go here */}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
