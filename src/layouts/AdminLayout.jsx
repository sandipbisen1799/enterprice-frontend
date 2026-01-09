import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { logoutAPI } from "../services/user.service";
import { useApi } from "../context/contextApi";
import { Bell, Triangle, CircleChevronDown } from "lucide-react";
function AdminLayout() {
  const { setUser, setIsLogin } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBar,setNavbar]= useState(false)

  const itemClass = (path) =>
    `cursor-pointer w-full py-2 flex items-center text-white text-gray-900 font-semibold justify-center transition capitalize h-12
     ${
       location.pathname === path
         ? "bg-[#7D6CCA]  font-semibold shadow-md"
         : " hover:bg-[#7d6ccaa5] "
     }`;

  const logoutHandler = async () => {
    try {
      const res = await logoutAPI();

      if (res?.data?.success) {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
        setIsLogin(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex   flex-col w-full h-screen relative  ">
      <div className="fixed w-full  flex flex-row items-center bg-[#514390] z-40  h-16">
        <div className=" min-w-1/2    md:px-12 flex flex-row items-center  gap-4  ">
          <h1 className="text-white font-semibold text-2xl ">Winden</h1>
          <input
            type="text"
            placeholder="  search... "
            className="bg-white w-full outline-none py-2 rounded-sm capitalize "
          />
        </div>
        <div className="min-w-1/2 flex flex-row items-center">
          <div className="md:min-w-1/2 h-full"></div>
        <div className="   min-w-1/2  px-2  flex flex-row md:ml-6  justify-evenly items-center    ">

          <Bell color="#ffffff" />
          <div className="w-12 h-10 bg-white rounded-sm">
            <img src="" alt="" />
          </div>
          <div className="flex flex-col text-white capitalize ">
            <h1>name</h1>
            <h1>accountType</h1>
          </div>
          <div className=" realative  " onClick={()=>setNavbar(!navBar)}>
            <CircleChevronDown color="#ffffff" />
            <div className={`${navBar ? 'flex absolute z-40':'hidden'} `}> <div
                className={`${itemClass("/profile")}  `}
                onClick={() => navigate("/profile")}
              >
                profile
              </div>
              <div className={`${itemClass("/login")}`} onClick={logoutHandler}>
                logout
              </div></div>
          </div>
        </div>
        </div>
        <div className="w-1/2 h-full flex-row  justify-between items-center  "></div>
      </div>
      <div className="w-full flex flex-row relative  ">
        <button
          className="md:hidden  bg-[#7d6ccaa5] flex flex-col justify-center cursor-pointer  top-3 fixed left-3.5 items-center z-1000"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-gray-800 mb-1 capitalize"></span>
          <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
        </button>
        <div
          className={`fixed top-16 left-0 ${
    menuOpen ? "flex" : "hidden"
  } md:flex flex-col justify-between 
  w-2/4 md:w-1/5 
  bg-[#6E5CC2] 
  border-r-2 border-gray-300 shadow-lg 
  h-[calc(100vh-4rem)] 
  z-30`}
        >
          <div className="flex flex-col justify-between items-center py-1">
            <div
              className={`${itemClass("/admin")} mt-5`}
              onClick={() => navigate("/admin")}
            >
              <h1>dashboard</h1>
            </div>
            <div
              className={itemClass("/admin/users")}
              onClick={() => navigate("/admin/users")}
            >
              <h1>users</h1>
            </div>
            <div
              className={itemClass("/admin/projectmanager")}
              onClick={() => navigate("/admin/projectmanager")}
            >
              <h1>projectManager</h1>
            </div>
            <div
              className={itemClass("/admin/projects")}
              onClick={() => navigate("/admin/projects")}
            >
              <h1>projects</h1>
            </div>
            <div
              className={itemClass("/admin/ip")}
              onClick={() => navigate("/admin/ip")}
            >
              <h1>ipaddress</h1>
            </div>
             
          </div>
          <div className="flex flex-col justify-between items-center py-1">
            <div className="flex flex-col gap-2  justify-between w-full  ">
            
            </div>
          </div>
        </div>
        <div className=" w-full md:w-4/5 md:ml-[20%]   ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
