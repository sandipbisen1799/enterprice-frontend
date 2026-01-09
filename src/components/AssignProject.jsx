
import { useEffect, useState } from "react";
import React from "react";
import { assignProjectAPI, getAllProjectAPI,  } from "../services/user.service";
 
function AssignProject({ onClose, projectManagerId }) {
      const [formData, setFormdata] = useState({projectId:'' });
      const [projects, setProjects]= useState([])
      // Handle input change
      function handlechange(event) {
        const { name, type, value, checked } = event.target;
        setFormdata((prevFormdata) => ({
          ...prevFormdata,
          [name]: type === "checkbox" ? checked : value,
        }));
      }

        const submitHandler = async () => {
   
   try {  
    const projectId =formData.projectId;
    console.log(projectId)
      const res= await assignProjectAPI(projectId,projectManagerId);  
      onClose();
      console.log(res);

        
    } catch (error) {
      console.error(error.response?.data?.message);
    }}
      const fetchProject = async () => {
        try {
          const data = await getAllProjectAPI();
          console.log(data.data.projects)
          setProjects(data.data.projects || []);
          
        } catch (error) {
          console.log(error.response?.data || error.message);
        }
      };

    useEffect(() => {
       fetchProject();
     }, []);
      
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

        <h2 className="text-xl font-bold mb-4">assign the project</h2>

       <label className="flex flex-col w-full   " htmlFor="name">
        <h1 className="text-gray-800 font-semibold text-lg">Name of the Project </h1>
         
 <select  name="projectId" value={formData.projectId} onChange={handlechange}  className=" textarea w-full  h-full p-1  outline-none  border border-gray-200 bg-[#FFFFFF]  font-normal rounded-sm">
  {projects.map((project)=>(
   
    <option className="w-full h-full flex flex-col"  key={project._id} value={project._id}>
        
        {`${project.name}    ${project.status}`}          

        </option>

  ))}
       </select>

       </label>
     

        <div className="flex mt-5 justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
          onClick={submitHandler}
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
            assign the project
          </button>
        </div>
      </div>
    </>
  );
}


export default AssignProject;