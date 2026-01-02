import { useState } from "react";
import SettingsMenu from "../components/SettingsMenu";
import Permissions from "../components/settings/Permissions";
import CreateNewMenu from "../components/settings/CreateNewMenu";
import ProfilePanel from "../components/AdvanceSttingMenus/ProfilePanel";
import CreateRoleForm from "../components/AdvanceSttingMenus/Role-&-Permission/CreateRole";

export default function AdvanceSetting() {
    const [Page, setPage] = useState('Account')
    const [PageValue, setPageValue] = useState("")
    const user = JSON.parse(localStorage.getItem('user'))
    
  
   const handleRecievePage = (page) => {
    setPage(page);
    }

    console.log("user", user)

  return (
    <>
    <div className="flex h-screen">
       {/* <Navbar /> */}
        <SettingsMenu setCurrentPage={handleRecievePage} />
        {Page === 'Account' ?(
            <div className="">
                <ProfilePanel/>
            </div>
        ): Page === 'Permission' ?(
            <Permissions/>
        ): Page === 'Role & Access' ?(
            <div className="w-full p-4">
                <CreateRoleForm companyId={user.companyId} />
            </div>
        ): Page === 'Add new Menu' ?(
            <div className=" w-full bg-white justify-center items-center border ">
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
    </div>
    
    </>

  );
}
