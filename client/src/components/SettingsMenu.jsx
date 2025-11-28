import React, {useState} from 'react'
import { User, ShieldUser,Wrench, UserCog, Settings, FilePlus2, Mail, Workflow, Bell, CreditCard, Globe, Shield, Database, Layers, Code } from 'lucide-react';

const SettingsMenu = ({setCurrentPage}) => {
    const [settingMenu, setsettingMenu] = useState([
        { icon: User, label: "Account", active:true },
        { icon: Settings, label: "Permission", active:false },
        { icon: ShieldUser, label: "Role & Access", active:false },
        { icon: FilePlus2, label: "Add new Menu", active:false },
        { icon: UserCog, label: "User setting", active:false },
        { icon: Mail, label: "Email", active:false },
        { icon: Workflow, label: "Workflow Automation", active:false },
        { icon: Bell, label: "Notifications", active:false },
        { icon: CreditCard, label: "Billing", active:false },
        { icon: Settings, label: "Audit Logs", active:false },
        { icon: Globe, label: "Localization", active:false },
        { icon: Shield, label: "Privacy & Security", active:false },
        { icon: Database, label: "Backup & Restore", active:false },
        { icon: Layers, label: "Integration", active:false },
        { icon: Code, label: "Developer Setting", active:false },
        { icon: Wrench, label: "General", active:false },
    ])

    const handleActiveMenu = (index) => {
    setsettingMenu(prev =>
        prev.map((item, i) => ({
        ...item,
        active: i === index
        }))
    );
    
    setCurrentPage(settingMenu[index].label);
    };

    

  return (
    <div className='w-40 sidebarHeight bg-[#001233] text-white absolute top-10 left-0 sidebarHeight overflow-y-scroll pt-14 px-2 space-y-1'>
        {settingMenu.map((item, index) => (
            <div 
            onClick={()=>handleActiveMenu(index)}
            key={index} 
            className={"flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-300 hover:text-[#001233] transition-all" + (item.active ? " bg-gray-100 text-[#001233]" : "")}>
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
            </div>
        ))}
    </div>
  )
}

export default SettingsMenu
