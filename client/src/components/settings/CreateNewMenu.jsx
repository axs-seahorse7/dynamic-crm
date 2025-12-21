import React , {useState} from "react";
import { IoClose } from "react-icons/io5";
import { CirclePlus, Folder } from "lucide-react";
import { Modal, Badge,  } from "antd";
import { useNavigate } from "react-router-dom";
import PostCard from "../Cards/PostCard.jsx";


export default function CreateNewMenu() {
    const [FormState, setFormState] = useState("createMenu")
    const navigate = useNavigate();
      const [open, setOpen] = useState(false);


    const selectFormType = (e) => {
        setFormState(e)
    }

  return (
    <div className="w-full h-full flex justify-center items-center" >
      <div className="bg-slate-200 w-full h-full rounded shadow-lg ">
        
        <div className="w-full flex gap-10 items-center justify-between shadow-b shadow bg-white h-14 px-8 ">
            <div className="w-3/5 h-10 border border-gray-400 rounded-full">
                <input type="text" placeholder="Search" className="w-full h-full rounded-full px-4 outline-none" />
            </div>
            <div title="Create manually" onClick={() => setOpen(true)} className=" text-white flex h-10 px-4 bg-emerald-500 rounded-full justify-center items-center gap-3 hover:bg-emerald-700 cursor-pointer">
               <CirclePlus /> Create your own menu
            </div>
            <div title="Saved Designs" className=" text-gray-500 flex  p-2 rounded-full justify-center items-center gap-3 cursor-pointer">
              <Badge count={5}><Folder size={26} /> </Badge>
            </div>
        </div>

        <section className="post pt-2 flex px-8 gap-4 h-[calc(100vh-60px)]">
            <div className="flex h-full overflow-y-scroll flex-col gap-6" style={{scrollbarWidth:"none"}}>
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
            </div>
            <div>
                sponsered ads
            </div>
            
        </section>
        

        <div>
    </div>


    <div className=" ">

      <Modal
        title={FormState === "createMenu" ? "Create New Menu" : "Update Menu"}
        okText="Proceed"
        open={open}
        onOk={() => navigate("/account/test")}
        onCancel={() => setOpen(false)}
      >

        <div className="flex  gap-5 py-10">
            <button onClick={()=> selectFormType('editMenu')} className={`${FormState === "editMenu" ? "selectedButton" :" button"}`}>Update existing menu</button>
            <button onClick={()=> selectFormType('createMenu')} className={`${FormState === "createMenu" ? "selectedButton" :" button"}`}>Create new menu</button>
        </div>
        {/* Input – Menu Name */}
        {FormState === 'createMenu' &&(
            <div className="flex flex-col gap-2 py-5">
                <label className="font-medium">Menu Name</label>
                <input type="text" className="border inputField px-4 py-2 rounded w-full" placeholder="Enter menu name"/>
                <select name="formtype" id="" className="selectList w-full outline-none">
                    <option value="" hidden >select form type</option>
                    <option value="">Flat List</option>
                    <option value="">Form</option>
                </select>
              
            </div>
        )}

        {FormState === 'editMenu' &&(
            <div className="flex flex-col gap-2 py-5">
                <label className="font-medium">Select Menu to Edit</label>
                <select name="formtype" id="" className="selectList w-full outline-none">
                    <option value="" hidden >Select Menu</option>
                    <option value="">Menu 1</option>
                    <option value="">Menu 2</option>
                    <option value="">Menu 3</option>
                </select>
                <label className="font-medium pt-3">Menu Name (optional)</label>
                <input type="text" className="border inputField px-4 py-2 rounded w-full" placeholder="Change menu name"/>
                
            </div>
        )}
        
      </Modal>

    </div>

      </div>
    </div>
  );
}
