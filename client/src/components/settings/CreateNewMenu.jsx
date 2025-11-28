import React , {useState} from "react";
import { IoClose } from "react-icons/io5";

export default function CreateNewMenu() {
    const [FormState, setFormState] = useState("createMenu")

    const selectFormType = (e) => {
        setFormState(e)
    }

  return (
    <div className="w-full h-full inset-0 pl-40 pt-10 bg-black/20 ">
      <div className="bg-white w-full h-full rounded shadow-lg p-8 ">
        <div className="flex  gap-5 py-10">
            <button onClick={()=> selectFormType('editMenu')} className={`${FormState === "editMenu" ? "selectedButton" :" button"}`}>Edit existing menu</button>
            <button onClick={()=> selectFormType('createMenu')} className={`${FormState === "createMenu" ? "selectedButton" :" button"}`}>Create new menu</button>
        </div>
        {/* Input – Menu Name */}
        {FormState === 'createMenu' &&(
            <div className="flex flex-col gap-2 py-5">
                <label className="font-medium">Menu Name</label>
                <input type="text" className="border inputField px-4 py-2 rounded w-1/2" placeholder="Enter menu name"/>
                <select name="formtype" id="" className="selectList w-1/2 outline-none">
                    <option value="" hidden >select form type</option>
                    <option value="">Flat List</option>
                    <option value="">Form</option>
                </select>
                <select name="formtype" id="" className="selectList w-1/2 outline-none">
                    <option value="" hidden >Choose who can see</option>
                    <option value=""> Hidden for All</option>
                    <option value="">All Employee</option>
                    <option value="">Only HR</option>
                    <option value="">Only Managers</option>
                </select>
            <div>
                <button className="button bg-blue-600 text-white px-6 py-2 rounded mt-5">Create Menu</button>   
            </div>
            </div>
        )}

        {FormState === 'editMenu' &&(
            <div className="flex flex-col gap-2 py-5">
                <label className="font-medium">Select Menu to Edit</label>
                <select name="formtype" id="" className="selectList w-1/2 outline-none">
                    <option value="" hidden >Select Menu</option>
                    <option value="">Menu 1</option>
                    <option value="">Menu 2</option>
                    <option value="">Menu 3</option>
                </select>
                <label className="font-medium pt-5">Menu Name</label>
                <input type="text" className="border inputField px-4 py-2 rounded w-1/2" placeholder="Enter menu name"/>
                
                <select name="formtype" id="" className="selectList w-1/2 outline-none">
                    <option value="" hidden >Choose who can see</option>
                    <option value=""> Hidden for All</option>
                    <option value="">All Employee</option>
                    <option value="">Only HR</option>
                    <option value="">Only Managers</option>
                </select>
            <div>
                <button className="button bg-blue-600 text-white px-6 py-2 rounded mt-5">Save Changes</button>   
            </div>
            </div>
        )}

      </div>
    </div>
  );
}
