import React, { useEffect, useState } from "react";
import {
  getProjectManager,
  deleteProjectManagerAPI,
  createProjectManagerAPI,
  UpdateProjectManagerAPI,
} from "../../services/user.service.js";
import {Eye, EyeOff, Trash, UserRoundPen, EllipsisVertical} from "lucide-react"
import TablePagination from '../../components/ui/TablePagination.jsx'
import { assignProjectAPI, getAllProjectAPI,  } from "../../services/user.service.js";
import { toast } from 'react-toastify';
function Admin() {
  const [projectManager, setProjectManager] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [assignProject, setAssignProject] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const [menu, setMenu] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormdata] = useState({
    name: "",
    status: "",
    description: "",
    userName: "",
    email: "",
    password: "",
    accountType: "projectManager",
    projectId:'' 
  });
        const [projects, setProjects]= useState([])
  function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormdata((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const fetchProject = async () => {
        try {
          const data = await getAllProjectAPI();
          console.log(data.data.projects)
          setProjects(data.data.projects || []);
         
          
        } catch (error) {
          console.log(error.response?.data || error.message);
          toast.error("Failed to fetch project managers!");
        }
      };

  

  const fetchProjectManager = async () => {
    try {
      const data = await getProjectManager(page, 5);
      setProjectManager(data.users || []);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to fetch projects!");
    }
  };
  const handleDelete = async (user) => {
    try {
      const projectManagerId = user._id;
      if (window.confirm(`Are you sure you want to delete ${user.userName}?`)) {
        const res = await deleteProjectManagerAPI(projectManagerId);
        if(res?.success){
          fetchProjectManager();
          toast.success("Project manager deleted successfully!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete project manager!");
    }
  };
 
  const addprojectmanager = async () => {
    try {
      const res = await createProjectManagerAPI(formData);
      console.log(res);
      if(res?.data?.success){
        setIsEditOpen(false)
        fetchProjectManager();
        toast.success("Project manager added successfully!");
      }

    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error("Failed to add project manager!");
    }
  };
     const handleUpdateProjectManager = async () => {
   
   try {  
      const res= await UpdateProjectManagerAPI( userId, formData);  
      console.log(res);
      if(res?.success){
        setModify(false)
        fetchProjectManager();
        toast.success("Project manager updated successfully!");
      }


    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error("Failed to update project manager!");
    }}
        const handleAssignProject = async () => {
       
       try {  
        fetchProject();
        const projectId =formData.projectId;
        console.log(projectId);
        console.log(userId)
          const res= await assignProjectAPI(projectId,userId);  
          
          console.log(res);
      setAssignProject(false);
      toast.success("Project assigned successfully!");

       } catch (error) {
         console.error(error.response?.data?.message);
         toast.error("Failed to assign project!");
       }}

  const handleAssignButton =(user)=>{
      setUserId(user._id);
    fetchProject();
    setAssignProject(true);

  }
  const handleModifyButton = (user) => {
    setFormdata({
      userName: user.userName || "",
      email: user.email || "",
      password: "",
      accountType: "projectManager",
      projectId: user.projectId || ""
    });
    setUserId(user._id);
    setModify(true);
  }
   const columns = [
  {
    key: "index",
    label: "Index",
    render: (_, index) => index,
  },
  {
    key: "userName",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "active",
    label: "Status",
  },
];

  useEffect(() => {
    fetchProjectManager();
  
  }, [page]);

  return (
    <div className="min-h-screen px-5 bg-[#F7F7F7] flex flex-col items-center gap-3 ">
      <div className="w-full h-20 justify-between flex flex-row items-center ">
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
      {projectManager.length==0 ?(<h2>there are no project manager</h2>):(  
        <TablePagination
  columns={columns}
  data={projectManager}
  page={page}
  totalPages ={totalPages}
  total={projectManager.length}
  onPageChange={setPage}
renderActions={(user) => (
 <div className="flex gap-2 place-content-center text-left text-[#705CC7] relative">
   <EllipsisVertical
     className="cursor-pointer"
     onClick={() =>
       setMenu(menu === user._id ? null : user._id)
     }
   />

   {menu === user._id && (
     <div className="absolute right-12  top-10 bg-white shadow-md rounded w-36 z-50">
       <div
         className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => {
           handleModifyButton(user);
           setMenu(null);
         }}
       >
         Edit
       </div>

       <div
         className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => {
           handleDelete(user);
           setMenu(null);
         }}
       >
         Delete
       </div>

       <div
         className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
         onClick={() => {
           handleAssignButton(user);
           setMenu(null);
         }}
       >
         Assign Project
       </div>
     </div>
   )}
 </div>
)}
 />)}
    


      {/* <div className="w-full max-w-3xl bg-gray-200 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
        {projectManager.length === 0 && (
          <p className="text-center text-gray-600">
            No project managers found.
          </p>
        )}

        {projectManager.map((user) => (
          <div
            key={user._id}
            className="flex flex-col gap-y-2 justify-between "
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4 flex flex-col sm:flex-row sm:justify-between gap-3">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                  <h2 className="text-sm text-gray-500">Name</h2>
                  <p className="font-medium text-gray-900">{user.userName}</p>
                </div>

                <div>
                  <h2 className="text-sm text-gray-500">Email</h2>
                  <p className="text-gray-800 break-all">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-2">
                <button
                  className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
                  onClick={() => {
                    setModify(true);
                    setUserId(user._id);
                  }}
                >
                  
                  modify
                </button>
                <button
                  className="px-6 py-2 hover:scale-101 rounded-lg text-gray-800 font-semibold text-center bg-[#c0161647] hover:bg-red-400 transition-all cursor-pointer capitalize"
                  onClick={() => handleDelete(user)}
                >
                  
                  delete
                </button>
              </div>
            </div>
            <button
              className="px-6 py-2 hover:scale-101  rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
              onClick={() => 
                handleAssignButton(user)
              
              }
            >
              
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
      </div> */}
      {isEditOpen && (
        // <CreateProjectManager onClose={() => setIsEditOpen(false)} />
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={()=>setIsEditOpen(false)} />

          {/* Modal */}
          <div
            className="fixed z-50 top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2
                bg-white p-6 rounded shadow w-96"
          >
            <h2 className="text-xl font-bold mb-4">Add the project Manager</h2>

            <label className="flex flex-col w-full  " htmlFor="Userame">
              <h1>Username</h1>
              <input
                placeholder="write the Username"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handlechange}
                className="border p-2 w-full mb-4"
              />
            </label>
            <label className="flex flex-col w-full" htmlFor="email">
              <h1>Email</h1>
              <input
                placeholder="write the email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              />
            </label>
            {showPassword ? (
              <label className="flex  flex-col w-full" htmlFor="text">
                <h1>Password</h1>
                <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
                  <input
                    placeholder=" password"
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handlechange}
                    className=" p-2  w-full mb-4 outline-none "
                  />
                  <div
                    className="text-center  place-items-center   "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeOff />
                  </div>
                </div>
              </label>
            ) : (
              <label className="flex  flex-col w-full" htmlFor="text">
                <h1>Password</h1>
                <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
                  <input
                    placeholder=" password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handlechange}
                    className=" p-2  w-full mb-4 outline-none "
                  />
                  <div
                    className="text-center  place-items-center   "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye />
                  </div>
                </div>
              </label>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={()=>setIsEditOpen(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button
                onClick={addprojectmanager}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add the ProjectManager
              </button>
            </div>
          </div>
        </>
      )}

      {modify && (
       
        <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={()=>setModify(false)}
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
            onClick={()=>setModify(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
          onClick={handleUpdateProjectManager}
          className="px-4 py-2 bg-green-500 text-white rounded">
            Update the ProjectManager
          </button>
        </div>
      </div>
    </>
      )}

      {assignProject && (
       <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={()=>setAssignProject(false)}
      />

  
      <div className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96">

        <h2 className="text-xl font-bold mb-4">assign the project</h2>

       <label className="flex flex-col w-full   " htmlFor="name">
        <h1 className="text-gray-800 font-semibold text-lg">Name of the Project </h1>
         
 <select  name="projectId" value={formData.projectId} onChange={handlechange}  className=" textarea w-full  h-full p-1  outline-none  border border-gray-200 bg-[#FFFFFF]  font-normal rounded-sm">
 
  
{projects.length === 0 ? (
  <option disabled>No projects available</option>
) : (
  projects.map((project)=>(
    <option className="w-full h-full flex flex-col"  key={project._id} value={project._id}>
        {`${project.name}    ${project.status}`}          
    </option>
  ))
)}
       </select>

       </label>
     

        <div className="flex mt-5 justify-end gap-2">
          <button
            onClick={()=>setAssignProject(false)}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
          onClick={handleAssignProject}
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
            assign the project
          </button>
        </div>
      </div>
    </>

        
      )}
    </div>
  );
}

export default Admin;

