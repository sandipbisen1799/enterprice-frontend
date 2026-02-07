import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

import React from "react";
function TeamMemberLayout() {
  const navigate = useNavigate();

    const drawerItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/teammember" },
      {
      text:"profile",
      icon:<User size={20}/>,
      path:'/teammember/profile'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-100  " >
           <ResponsiveDrawer lists={drawerItems} onNavigate={(path) => navigate(path)}>
            <Outlet />
          </ResponsiveDrawer>
      </div>
   
  );
}

export default TeamMemberLayout;
