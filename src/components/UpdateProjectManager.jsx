
import { useState } from "react";
import React from "react";
import {  UpdateProjectManagerAPI } from "../services/user.service";
import {Eye, EyeOff} from "lucide-react"
 
function UpdateProjectManager({  onClose, projectManagerId }) {
    console.log(projectManagerId);
      const [formData, setFormdata] = useState({ userName: "", email: "", password:"",accountType:'projectManager' });
      const [showPassword, setShowPassword]= useState(false)
      function handlechange(event) {
        const { name, type, value, checked } = event.target;
        setFormdata((prevFormdata) => ({
          ...prevFormdata,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
        const submitHandler = async () => {
   
   try {  
      const res= await UpdateProjectManagerAPI( projectManagerId, formData);  
      console.log(res);

        
    } catch (error) {
      console.error(error.response?.data?.message);
    }}

   
      
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96">

        <h2 className="text-xl font-bold mb-4">update the project Manager</h2>

       <label className="flex flex-col w-full  " htmlFor="Userame">
        <h1>Username</h1>
         <input placeholder="write the Username"
        name="userName"
        type="text"
    
           value={formData.userName}
            onChange={handlechange}
          className="border p-2 w-full mb-4"
        />
       </label>
       <label className="flex flex-col w-full" htmlFor="email">
        <h1>Email</h1>
            <input placeholder="write the email"
         type="email" 
         name="email"
          value={formData.email}
            onChange={handlechange}
          className="border p-2 w-full mb-4 "
        />

       </label>
       {showPassword ?(  
         <label className="flex  flex-col w-full" htmlFor="text">
        <h1>Password</h1>
   <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
        <input placeholder=" password"
        type="text"
         name="password"
          value={formData.password}
            onChange={handlechange}
          className=" p-2  w-full mb-4 outline-none "
          
        />
        <div className="text-center  place-items-center   " onClick={()=>setShowPassword(!showPassword)}>
            <EyeOff />
        </div>
        </div>
        


       </label>

       ):(   <label className="flex  flex-col w-full" htmlFor="text">
        <h1>Password</h1>
   <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
        <input placeholder=" password"
        type="password"
         name="password"
          value={formData.password}
            onChange={handlechange}
          className=" p-2  w-full mb-4 outline-none "
          
        />
        <div className="text-center  place-items-center   " onClick={()=>setShowPassword(!showPassword)}>
            <Eye />
        </div>
        </div>
        


       </label>)}
      

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
          onClick={submitHandler}
          className="px-4 py-2 bg-green-500 text-white rounded">
            Update the ProjectManager
          </button>
        </div>
      </div>
    </>
  );
}


export default UpdateProjectManager;