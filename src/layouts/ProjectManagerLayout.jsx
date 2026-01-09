import React from 'react'
import { Outlet,useNavigate, useLocation } from 'react-router'
import { useState } from 'react';
import { logoutAPI } from '../services/user.service';
import { useApi } from '../context/contextApi';
function ProjectManagerLayout() {
const {setUser, setIsLogin}= useApi();
  const location = useLocation();
  const navigate =useNavigate();
  const [menuOpen ,setMenuOpen]= useState(false);
  console.log(menuOpen);
  
    const itemClass = (path) =>
    `cursor-pointer w-full py-2 flex items-center text-gray-900 font-semibold justify-center rounded-2xl  text-lg transition capitalize
     ${
       location.pathname === path
         ? "bg-purple-200 text-purple-700 font-semibold shadow-md"
         : "bg-purple-100 text-purple-800 hover:bg-purple-200/90 border border-gray-200"
     }`;
     
    const logoutHandler = async () => {
      try {
        const res = await logoutAPI();

        if (res?.data?.success) {
            localStorage.removeItem("token");
            setUser(null)
          navigate("/login");
          setIsLogin(false)
        }
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div className='flex flex-row  w-full h-full relative '>  
       <button className='md:hidden flex flex-col justify-center cursor-pointer  top-3 fixed left-3.5 items-center z-30' onClick={() => setMenuOpen(!menuOpen)}>
        <span className='block w-6 h-0.5 bg-gray-800 mb-1 capitalize'></span>
        <span className='block w-6 h-0.5 bg-gray-800 mb-1'></span>
        <span className='block w-6 h-0.5 bg-gray-800'></span>
      </button>
       <div className={`${menuOpen?'flex fixed bg-purple-50 ':'hidden'} w-3/4  md:flex flex-col items-center py-5 px-2 scroll-smooth md:scroll-auto overflow-y-scroll  gap-y-5 md:w-1/5  bg-purple-00 border-r-2  border-gray-300 shadow-lg h-full z-10 `}>
               

       <div className={`${itemClass('/projectmanager')} mt-12`} onClick={()=>navigate('/projectmanager')}>
        <h1>dashboard</h1>
       </div>
          <div className={itemClass("/projectmanager/teammember")} onClick={()=>navigate('/projectmanager/teammember')}>
        <h1 >teamMember</h1>
       </div>
       <div className={itemClass("/projectmanager/projects")} onClick={()=>navigate('/projectmanager/projects')}>
        <h1>projects</h1>
       </div>
     

  <div className='mt-auto flex flex-col gap-2  justify-between w-full  '>
<div className={`${itemClass("/profile")}  `} onClick={()=>navigate('/profile')}>
       profile
       </div>
       <div className={`${itemClass("/login")}`} onClick={logoutHandler}>
      logout
       </div>
  </div>
       
       
       </div>

   
          <div className=' w-full md:full'>
          
          <Outlet/></div>
    </div>

  )
}

export default ProjectManagerLayout ;