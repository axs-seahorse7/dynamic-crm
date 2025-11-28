import React from 'react'
import { ChevronRight } from "lucide-react";

const Permissions = () => {
    const permissions = [
    "Patients Access",
    "Appointments Access",
    "Patients Access",
    "Appointments Access",
    "Consultation Access",
    "Prescriptions Access",
    "Billing Access",
    "Files Access",
    "Report Access",
  ];
    const [active, setActive] = React.useState(0);
  return (
    <div className="w-full h-screen bg-[#ebebeb] pt-15 pl-44 pr-5 overflow-y-scroll rounded">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Permission</h2>

        <button className="flex items-center gap-2 bg-white border border-[#187f7b] text-[#187f7b] shadow px-4 py-1 rounded-md text-sm hover:bg-gray-100">
          Create new menu <span className="text-xl font-bold">+</span>
        </button>
      </div>

      {/* Permission List */}
      <div className="space-y-3 pb-14">
        {permissions.map((item, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`flex items-center justify-between px-4 py-3 rounded shadow cursor-pointer transition-all
              ${
                active === i
                  ? "bg-gray-200 border-gray-300"
                  : "bg-white hover:bg-gray-100"
              }
            `}
          >
            <span className="text-sm font-medium">{item}</span>
            <ChevronRight size={18} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Permissions
