import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell, BookUser, CircleChevronDown, FolderDot, LayoutDashboard, SquareChartGantt, User, UserCheck } from "lucide-react";
import { logoutAPI } from "../services/user.service";
import { useApi } from "../context/contextApi";
import  profileimage from  '../assets/profileimg.png'
function AdminLayout() {
  const { setUser, setIsLogin,user } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBar, setNavbar] = useState(false);

  const itemClass = (path) =>
    `cursor-pointer w-full py-3 flex items-center gap-x-4  justify-start capitalize text-white font-semibold transition
     ${
       location.pathname === path
         ? "bg-[#7D6CCA] shadow-sm"
         : "hover:bg-[#7d6ccaa5]"
     }`;

  const logoutHandler = async () => {
    try {
      const res = await logoutAPI();
      if (res?.data?.success) {
        localStorage.removeItem("token");
        setUser(null);
        setIsLogin(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100  " >

  
      <header className="fixed top-0 left-0 w-full h-16 bg-[#514390] z-40 flex items-center px-4 md:px-12">
        <div className="flex items-center gap-2 md:gap-4 w-1/2">
          <h1 className="text-white text-xl md:text-2xl font-semibold">Winden</h1>
          <input
            type="text"
          placeholder="&#xF002; Search"
            className="font-[FontAwesome] hidden md:block bg-white w-full py-2 px-3 rounded outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center justify-end w-1/2 gap-2 md:gap-4 text-white">
          <Bell />
          <div onClick={() => navigate("/admin/profile")} className="w-10 h-10 cursor-pointer overflow-hidden rounded">
            <img src={profileimage} className="inset-0 w-full h-full" alt="fg" />
            </div> 
          <div className="hidden md:flex flex-col text-center text-sm capitalize">
            <span className="font-semibold text-xl ">{user.userName}</span>
            <span>{user.accountType}</span>
          </div>

          <div className="relative">
            <CircleChevronDown
              className="cursor-pointer"
              onClick={() => setNavbar(!navBar)}
            />

            {navBar && (
              <div className="absolute right-0   overflow-hidden top-10 bg-white shadow-md rounded w-36 z-999">
              
                <div
                  className=" text-black px-4 z-100 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={logoutHandler}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

    
      <div className="pt-16 flex">


        <button
          className="md:hidden fixed top-20 left-4 z-50 bg-[#7D6CCA] p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

    
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-2/3 md:w-1/5
          bg-[#6E5CC2] z-30 transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <nav className="flex flex-col mt-5 ">
            <div className={  itemClass("/admin")} onClick={() => navigate("/admin")}>
             <LayoutDashboard className="ml-16" fill="#fff" /> Dashboard
            </div>
            <div className={itemClass("/admin/users")} onClick={() => navigate("/admin/users")}>
             <  User className="ml-16" fill="#fff" />   Users
            </div>
            <div className={itemClass("/admin/projectmanager")} onClick={() => navigate("/admin/projectmanager")}>
             <FolderDot  className="ml-16" fill="#fff" />  Project Manager
            </div>
            <div className={itemClass("/admin/projects")} onClick={() => navigate("/admin/projects")}>
             <SquareChartGantt className="ml-16" fill="#fff" />  Projects
            </div>
            <div className={itemClass("/admin/ip")} onClick={() => navigate("/admin/ip")}>
             <BookUser className="ml-16" fill="#fff"  />  IP Address
            </div>
           
          </nav>
        </aside>

      
        <main
          className="ml-0 md:ml-[20%] w-full md:w-4/5
          h-[calc(100vh-4rem)] overflow-y-auto p-2 md:p-4 bg-gray-50"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
