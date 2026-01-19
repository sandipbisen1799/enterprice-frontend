import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Bell, CircleChevronDown, UserCheck } from "lucide-react";
import { logoutAPI } from "../services/user.service";
import { useApi } from "../context/contextApi";

function TeamMemberLayout() {
  const { setUser, setIsLogin } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBar, setNavbar] = useState(false);

  const itemClass = (path) =>
    `cursor-pointer w-full py-3 flex items-center justify-center capitalize text-white font-semibold transition
     ${
       location.pathname === path
         ? "bg-[#7D6CCA] shadow-md"
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
    <div className="relative min-h-screen bg-gray-100">

  
      <header className="fixed top-0 left-0 w-full h-16 bg-[#514390] z-40 flex items-center px-4 md:px-12">
        <div className="flex items-center gap-2 md:gap-4 w-1/2">
          <h1 className="text-white text-xl md:text-2xl font-semibold">Winden</h1>
          <input
            type="text"
            placeholder="Search..."
            className="hidden bg-white md:block w-full py-2 px-3 rounded outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center justify-end w-1/2 gap-2 md:gap-4 text-white">
          <Bell />
          <div className="w-10 h-10 bg-white rounded" />
          <div className="hidden md:flex flex-col text-sm capitalize">
            <span>Name</span>
            <span>AccountType</span>
          </div>

          <div className="relative">
            <CircleChevronDown
              className="cursor-pointer"
              onClick={() => setNavbar(!navBar)}
            />

          {navBar && (
              <div className="absolute right-0  overflow-hidden top-10 bg-white shadow-md rounded w-36 z-50">
                <div
                  className="text-black px-4 py-2 z-100 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/teammember/profile")}
                >
                Profile
                </div>
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
          <nav className="flex flex-col mt-5 gap-1">
            <div className={itemClass("/teammember")} onClick={() => navigate("/teammember")}>
              Dashboard
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

export default TeamMemberLayout;
