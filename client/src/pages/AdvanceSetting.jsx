import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SettingsMenu from "../components/SettingsMenu";
import Permissions from "../components/settings/Permissions";
import CreateNewMenu from "../components/settings/CreateNewMenu";

export default function AdvanceSetting() {
    const [Page, setPage] = useState('Account')
    const [PageValue, setPageValue] = useState("")
    
  

   const handleRecievePage = (page) => {
        setPage(page);
    }

  return (
    <>
        <Navbar />
        <SettingsMenu setCurrentPage={handleRecievePage} />
        {Page === 'Account' ?(
            <div className="px-52 py-40">Account -</div>
        ): Page === 'Permission' ?(
            <Permissions/>
        ): Page === 'Role & Access' ?(
            <div>Role & Access -</div>
        ): Page === 'Add new Menu' ?(
            <div className="h-screen w-full justify-center items-center border ">
                <CreateNewMenu />
            </div>
        ): Page === 'User setting' ?(
            <div>User setting -</div>
        ): Page === 'Email' ?(
            <div>Email -</div>
        ): Page === 'Workflow Automation' ?(
            <div>Workflow Automation -</div>
        ): Page === 'Notifications' ?(
            <div>Notifications -</div>
        ): Page === 'Billing' ?(
            <div>Billing -</div>
        ): Page === 'Audit Logs' ?(
            <div>Audit Logs -</div> 
        ): Page === 'Localization' ?(
            <div>Localization -</div>
        ): Page === 'Privacy & Security' ?(
            <div>Privacy & Security -</div>
        ): Page === 'Backup & Restore' ?(
            <div>Backup & Restore -</div>
        ): Page === 'Integration' ?(
            <div>Integration -</div>
        ): Page === 'Developer Setting' ?(
            <div>Developer Setting -</div>
        ): Page === 'General' ?(
            <div>General -</div>
        ):(
            <div>Settings</div>
        )

        }
    
    </>

  );
}
