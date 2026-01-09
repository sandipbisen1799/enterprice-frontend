import { createBrowserRouter } from "react-router";
import React from "react";
import Rootlayout from "../layouts/Rootlayout";
import AdminLayout from "../layouts/AdminLayout";
import ProjectManagerLayout from "../layouts/ProjectManagerLayout";
import TeamMemberLayout from "../layouts/TeamMemberLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Admin from "../pages/Admin";
import ProjectManager from "../pages/ProjectManager";
import TeamMember from "../pages/TeamMember";
import { RoleRoute } from "./RoleRouter";
import Profile from "../pages/profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "../pages/AdminDashboard";
import Project from "../pages/Project";
import Contactus from "../pages/Contact-us";
import ProjectManagerDashboard from "../pages/ProjectManagerDashbord";
import ManagerProject from "../pages/ManagerProject";
import Users from "../pages/User";
import Ipaddress from "../pages/Ipaddress";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "contact-us", element: <Contactus /> },
     
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "admin",
                element: <AdminLayout />,
                children: [{ index: true, element: <AdminPage />

                 },
                 {
                  path: "projectmanager",
                  element:<Admin></Admin>
                 },
                  {
                  path: "projects",
                  element:<Project></Project>
                 },
                   {
                  path: "users",
                  element:<Users></Users>
                 },
                 {
                  path: "ip",
                  element:<Ipaddress></Ipaddress>
                 },
                 
                 
                ],
              },
            ],
          },

          {
            element: <RoleRoute allowedRoles={["projectManager"]} />,
            children: [
              {
                path: "projectManager",
                element: <ProjectManagerLayout />,
                children: [{ index: true, element: <ProjectManagerDashboard /> },
                       {
                path:'teammember',
                element:<ProjectManager/>
              },

                    {
                path:'projects',
                element:<ManagerProject/>
              },
              
              
                ],


              },
            
            ],
          },

          {
            element: <RoleRoute allowedRoles={["teamMember"]} />,
            children: [
              {
                path: "teammember",
                element: <TeamMemberLayout />,
                children: [{ index: true, element: <TeamMember /> }],
              },
            ],
          },
        ],
      },
    ],
  },
]);
