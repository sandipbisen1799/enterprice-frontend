import React, { useEffect, useState } from "react";
import { createMyTeamMember, deleteTeamMembersAPI, getMyTeamMembers } from "../services/projectManager.service.js";
import { Eye,EyeOff } from "lucide-react";
import { useApi } from "../context/contextApi.jsx";
function ProjectManager() {
  const {user}= useApi();

  const [teamMembers, setTeamMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createTeamMember,setCreateTeamMember]=useState(false)
  const [showPassword,setShowPassword]= useState(false)
  const [formData,setFormdata] =useState({userName:'',email:'',password:''})
  const [modify,setModify]=useState(false);
  function handlechange(event) {
  
        const { name, type, value, checked } = event.target;
        setFormdata((prevFormdata) => ({
          ...prevFormdata,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
  const fetchTeamMembers = async () => {
    try {
      const data = await getMyTeamMembers(page, 2);
      console.log(data)
      setTeamMembers(data.users || []);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [page]);
  const handleCreateTeamMember=async()=>{
    const ProjectManagerId = user._id ;
    console.log(ProjectManagerId)
    const res = await createMyTeamMember( ProjectManagerId,formData);
    console.log(res)
  }
  const handleDeletetuser = async (users)=>{
    try {
    console.log(user._id);
      console.log(users._id)
      const teamMemberId = users._id;
      const projectManagerId =user._id;
      if(window.confirm(`do you want to delete ${users.userName}`)){
      const data = deleteTeamMembersAPI(teamMemberId,projectManagerId);}
      console.log(data);

  } catch (error) {
    console.log(error);
  }

  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:px-8 flex flex-col items-center gap-6">
      <div className="w-full  h-12  flex flex-row justify-between  items-center  text-2xl border-b border-gray-200 font-semibold "><h1> TeamMemberList</h1> <button
          className="px-6 py-2  hover:scale-101 hover:text-white text-lg rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize"
          onClick={() => setCreateTeamMember(true)}
        >
          add team member
        </button></div>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Project Manager Dashboard
        </h1>
        <p className="text-gray-700 mt-1">
          My Team Members
        </p>
      </div>

      <div className="w-full max-w-3xl bg-gray-200 rounded-2xl shadow-xl p-4 flex flex-col gap-4">

        {teamMembers.length === 0 && (
          <p className="text-center text-gray-600">
            No team members assigned.
          </p>
        )}

        {teamMembers.map((users) => (
          <div
            key={users._id}
            className="bg-white rounded-xl shadow-md border p-4 flex flex-col sm:flex-row justify-between gap-3"
          >
            <div className="flex w-full flex-col justify-between items-start gap-2">
    <div>
              <h2 className="text-sm text-gray-500">Name</h2>
              <p className="font-medium text-gray-900">
                {users.userName}
              </p>
            </div>
              <div>
              <h2 className="text-sm text-gray-500">Email</h2>
              <p className="text-gray-800 break-all">
                {users.email}
              </p>
            </div>

            </div>
            <div className="flex flex-col gap-1.5"> 
              <button className="px-4 py-1 bg-yellow-50 rounded-lg shadow-lg border cursor-pointer border-blue-200" >update</button>
               <button className="px-4 py-1 bg-orange-200 hover:bg-orange-300 rounded-lg shadow-sm border border-blue-200"onClick={()=>handleDeletetuser(users)}>delete</button>

            </div>
        
        
            

          
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 rounded-lg bg-green-200 disabled:bg-gray-300"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 rounded-lg bg-green-200 disabled:bg-gray-300"
        >
          Next 
        </button>
      </div>
      {
        createTeamMember &&(
          <>
 <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={()=>setCreateTeamMember(false)}
      />
      <div className=" fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-5 rounded shadow w-96   flex flex-col justify-between items-center  ">
    
       <label className="  w-full flex flex-col gap-1 " htmlFor="username">
        <h1>userName</h1>
        <input value={formData.userName} onChange={handlechange} name="userName"  type="text" className="w-full outline-none  border border-gray-400 p-2 rounded-lg capitalize" placeholder="enter the teammember name" />
      

       </label>
        <label className="  w-full flex flex-col gap-1 " htmlFor="username">
        <h1>Email</h1>
        <input name="email" type="email" value={formData.email} onChange={handlechange} className="w-full outline-none  border border-gray-400 p-2 rounded-lg " placeholder="enter the teammember name" />
      

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
              <div className="flex flex-row justify-between items-center gap-1 ">
<button className="px-2 py-1 bg-red-300 hover:bg-red-400 rounded-lg " onClick={()=>setCreateTeamMember(false)}>Cancel</button>
<button className="px-2 py-1 bg-blue-300 hover:bg-blue-400 rounded-lg " onClick={handleCreateTeamMember}>Create TeamMember</button>

              </div>
       </div>
      
      
         </>      
        )
      }
    </div>
  );
}

export default ProjectManager;
