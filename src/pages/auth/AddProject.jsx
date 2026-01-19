import React from 'react'
import { useState } from 'react';
import { createProjectAPI } from "../../services/user.service.js";
function AddProject() {

      const [formData, setFormdata] = useState({
        name: "",
        status: "",
        description: "",
      });
        function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormdata((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
      const handleCreateProject = async () => {
    try {
      const res = await createProjectAPI(formData);
      console.log(res);
      setIsEditOpen(false)
      fetchProjects();
      toast.success("Project created successfully!");
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error("Failed to create project!");
    }
  };
 
 return (
    
        

<>
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            <h2 className="text-xl font-bold mb-4">create the project</h2>

            <label className="flex flex-col w-full  " htmlFor="name">
              <h1>name</h1>
              <input
                placeholder="write the name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handlechange}
                className="border p-2 w-full mb-4"
              />
            </label>
            <label className="flex flex-col w-full" htmlFor="discreption">
              <h1>description</h1>
              <input
                placeholder="write the discription"
                type="text"
                name="description"
                value={formData.description}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                create the project
              </button>
            </div>
          </div>
        </>

  )
}

export default AddProject