import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, BookUser, CircleChevronDown, FolderDot, LayoutDashboard, SquareChartGantt, User, UserCheck } from "lucide-react";

import React from "react";
function AdminLayout() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const [menuOpen, setMenuOpen] = useState(false);
  // const [navBar, setNavbar] = useState(false);

  // const itemClass = (path) =>
  //   `cursor-pointer w-full py-3 flex items-center gap-x-4  justify-start capitalize text-white font-semibold transition
  //    ${
  //      location.pathname === path
  //        ? "bg-[#7D6CCA] shadow-sm"
  //        : "hover:bg-[#7d6ccaa5]"
  //    }`;


    const drawerItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { text: "Users", icon: <User size={20} />, path: "/admin/users" },
    {
      text: "Project Manager",
      icon: <FolderDot size={20} />,
      path: "/admin/projectmanager",
    },
    {
      text: "Projects",
      icon: <SquareChartGantt size={20} />,
      path: "/admin/projects",
    },
    { text: "IP Address", icon: <BookUser size={20} />, path: "/admin/ip" },
      {
          text:"profile",
          icon:<User size={20}/>,
          path:'/admin/profile'
        }
  ];

  return (
    <div className="relative min-h-screen bg-gray-100  " >

{/*   
      <div className="pt-16 flex">


        <button
          className="md:hidden fixed top-20 left-4 z-50 bg-[#7D6CCA] p-2 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button> */}

    
        {/* <aside
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
        </aside> */}
  
{/*       
        <main
          className=" w-full   h-full flex flex-row"
        > */}
           <ResponsiveDrawer lists={drawerItems} onNavigate={(path) => navigate(path)}>
            <Outlet />
          </ResponsiveDrawer>
          
        {/* </main> */}
      </div>
  
  );
}

export default AdminLayout;
