import React, { useEffect, useState } from "react";
import { createMyTeamMember, deleteTeamMembersAPI, getMyTeamMembers, getTeamMemeberById,updateTeamMember } from "../../services/projectManager.service.js";

import { Eye,EyeOff, Trash, UserRoundPen, EllipsisVertical } from "lucide-react";
import { useApi } from "../../context/contextApi.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";
import { toast } from 'react-toastify';
function ProjectManager() {
  const {user}= useApi();

  const [teamMembers, setTeamMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createTeamMember,setCreateTeamMember]=useState(false)
  const [showPassword,setShowPassword]= useState(false)
  const [formData,setFormData] =useState({userName:'',email:'',password:'',phoneNumber :''})
  const [modify,setModify]=useState(false);
  const [userId, setUserId] = useState(null);
  const [menu, setMenu] = useState({
  open: false,
  user: null,
  x: 0,
  y: 0,
});
  function handlechange(event) {
  
        const { name, type, value, checked } = event.target;
        setFormData((prevFormdata) => ({
          ...prevFormdata,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
  const fetchTeamMembers = async () => {
    try {
      const data = await getMyTeamMembers(page, 5);
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
    try {
      const ProjectManagerId = user._id ;
      console.log(ProjectManagerId)
      const res = await createMyTeamMember( ProjectManagerId,formData);
      console.log(res);
      fetchTeamMembers();
      setCreateTeamMember(false)
      toast.success("Team member created successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create team member!");
    }
  }
  const handleDeletetuser = async (users)=>{
    try {
    console.log(user._id);
      console.log(users._id)
      const teamMemberId = users._id;
      const projectManagerId =user._id;
      if(window.confirm(`do you want to delete ${users.userName}`)){
      const data = await deleteTeamMembersAPI(teamMemberId,projectManagerId);
      console.log(data);
      fetchTeamMembers();
      toast.success("Team member deleted successfully!");
      }
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete team member!");
  }

  }
  const handleModifyButton = async(user)=>{
    try {
      
      const _id =user._id;
      const data = await getTeamMemeberById(_id);
     const userData = data.data.user ;
       setFormData({
        userName: userData.userName || "",
        email: userData.email || "",
    
        password: "",
        phoneNumber: userData.phoneNumber || "",
      });
       setModify(true);
            setUserId(user._id);
    } catch (error) {
      console.log(error)
    }
  }
  const onHandleModify = async () => {
    try {
      const _id = userId;
      const updatedData = formData;
       const projectManagerId = user._id
      const data = await updateTeamMember(_id, projectManagerId,updatedData);
      console.log(data);
      fetchTeamMembers()
      setModify(false);
      toast.success("Team member updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update team member!");
    }
    };
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
  return (
    <div className="min-h-screen px-5 bg-[#F7F7F7] flex flex-col items-center gap-3">
      <div className="w-full h-20 justify-between flex flex-row items-center ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">Team Member List</h1>
        <button
          className="px-6 py-2 hover:scale-101 hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize"
          onClick={() => setCreateTeamMember(true)}
        >
          add team member
        </button>
      </div>


      <div className="w-full  rounded-2xl  p-4 flex flex-col gap-4">

        {teamMembers.length === 0 && (
          <h2 className="text-center text-gray-600 text-xl font-semibold">There are no team members</h2>
        )}

      <TablePagination   
  columns={columns}
  data={teamMembers}
  page={page}
  totalPages ={totalPages}
  total={teamMembers.length}
  onPageChange={setPage}
renderActions={(user) => (
 <div className="flex gap-2 text-[#705CC7] relative">
   <EllipsisVertical
     className="cursor-pointer"
       onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMenu({
      open: true,
      user: user,
      x: rect.right - 150, 
      y: rect.top - 10,    
    });
  }}
   />

   {menu.open && menu.user._id === user._id && (
     <div style={{ position: 'fixed', left: menu.x, top: menu.y, zIndex: 50 }} className="bg-white shadow-md rounded w-36">
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
           handleDeletetuser(user);
           setMenu(null);
         }}
       >
         Delete
       </div>
     </div>
   )}
 </div>
)}
  //  renderExtra={(user)=>(
  //   <>
  //     <button
  //             className=" py-1 px-1  rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize "
  //             onClick={() => 
  //               handleAssignButton(user)
              
  //             }
  //           >
              
  //             assign the project
  //           </button>
  //   </>
     
  // )}
 />

        {/* {teamMembers.map((users) => (
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
        ))} */}
      </div>

      {/* <div className="flex items-center gap-4">
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
      </div> */}
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
        {modify && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setModify(false)}
                />
                <div
                  className="fixed z-50 top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2
              bg-white p-6 rounded shadow w-96"
                >
                  <h2 className="text-xl font-bold mb-4">update the user details </h2>
      
                  <label className="flex flex-col w-full  " htmlFor="userName">
                    <h1>Username</h1>
                    <input
                      placeholder="update the UserName"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handlechange}
                      className="border p-2 w-full mb-4"
                    />
                  </label>
                  <label className="flex flex-col w-full" htmlFor="email">
                    <h1>email</h1>
                    <input
                      placeholder="update the email"
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
                    <button
                      onClick={() => setModify(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
      
                    <button
                      onClick={onHandleModify}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Update the user
                    </button>
                  </div>
                </div>
              </>
            )}
    </div>
  );
}

export default ProjectManager;
