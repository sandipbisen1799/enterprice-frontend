import React, { useEffect, useState } from "react";
import { getProjectManager, deleteProjectManagerAPI } from "../services/user.service";

import CreateProjectManager from "../components/CreateProjectManager";
import UpdateProjectManager from "../components/UpdateProjectManager";
import AssignProject from "../components/AssignProject";

function Admin() {
  const [projectManager, setProjectManager] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [assignProject, setAssignProject] =useState(false)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
          const [formData, setFormdata] = useState({name:'',status:"",description:'' });
          const [showPassword,setShowPassword]=useState(false)
              
              // Handle input change
              function handlechange(event) {
                
                const { name, type, value, checked } = event.target;
                setFormdata((prevFormdata) => ({
                  ...prevFormdata,
                  [name]: type === "checkbox" ? checked : value,
                }));
              }
     
      

  const fetchProjectManager = async () => {
    try {
      const data = await getProjectManager(page, 2);
      setProjectManager(data.users || []);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
   const handleDelete= async (user)=>{

  try {
      
      const projectManagerId =user._id;
      if (window.confirm(`Are you sure you want to delete ${user.userName}?`)) {
      const res= await deleteProjectManagerAPI(projectManagerId);
      

    }
  } catch (error) {
    console.log(error);

  }
   }
   const handleclose= ()=>{
    setModify()
   }

  useEffect(() => {
    fetchProjectManager();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-8 flex flex-col items-center gap-6 ">
      <div className="w-full h-20  justify-between px-3 flex flex-row  items-center border-b border-gray-200  ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">
          project manager list
        </h1>
        <button
          className="px-6 py-2 hover:scale-101 hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize"
          onClick={() => setIsEditOpen(true)}
        >
          add project manager
        </button>
      </div>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-700 mt-1">Project Manager List</p>
      </div>

      <div className="w-full max-w-3xl bg-gray-200 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
        {projectManager.length === 0 && (
          <p className="text-center text-gray-600">
            No project managers found.
          </p>
        )}

        {projectManager.map((user) => (
          <div key={user._id} className="flex flex-col gap-y-2 justify-between " >
          <div
           
            className="bg-white rounded-xl shadow-md border border-gray-300 p-4 flex flex-col sm:flex-row sm:justify-between gap-3"
          >
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <h2 className="text-sm text-gray-500">Name</h2>
                <p className="font-medium text-gray-900">
                  {user.userName}
                
                </p>
              </div>  

              <div>
                <h2 className="text-sm text-gray-500">Email</h2>
                <p className="text-gray-800 break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2">
              <button
                className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
                onClick={()=>{setModify(true);setUserId(user._id)}}
              >
                {" "}
                modify
              </button>
              <button className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#c0161647] hover:bg-red-400 transition-all cursor-pointer capitalize"
              onClick={()=>handleDelete(user)}
              >
                {" "}
                delete
              </button>
            </div>
          </div>
        <button
                className="px-6 py-2 hover:scale-101  rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
                onClick={()=>{setAssignProject(true);setUserId(user._id)}}
              >
                {" "}
                assign the project to the projectManager 
              </button>
          </div>
        ))}
        
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
        >
          Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
        >
          Next
        </button>
      </div>
      {isEditOpen && (
        <CreateProjectManager onClose={() => setIsEditOpen(false)} />
      )}

      {modify && (
        <UpdateProjectManager
          projectManagerId={userId}
          onClose={() => setModify(false)}
        />
      )}
      
      {assignProject && (
        <AssignProject
          projectManagerId={userId}
          onClose={() => setAssignProject(false)}
          handleclose={handleclose}
        />
      )}
    </div>
  );
}

export default Admin;
