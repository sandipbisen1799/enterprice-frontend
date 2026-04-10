import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Rootlayout from "../layouts/Rootlayout";
import AdminLayout from "../layouts/AdminLayout";
import ProjectManagerLayout from "../layouts/ProjectManagerLayout";
import TeamMemberLayout from "../layouts/TeamMemberLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Admin from "../pages/auth/Admin";
import ProjectManager from "../pages/projectmanager/ProjectManager";
import TeamMember from "../pages/teamManager/TeamMember";
import { RoleRoute } from "./RoleRouter";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "../pages/auth/AdminDashboard";
import Project from "../pages/auth/Project";
import Contactus from "../pages/Contact-us";
import ProjectManagerDashboard from "../pages/projectmanager/ProjectManagerDashbord";
import ManagerProject from "../pages/projectmanager/ManagerProject";
import Users from "../pages/auth/User";
import Ipaddress from "../pages/auth/Ipaddress";
import AddProject from "../pages/auth/AddProject";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
   
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
                 {
                  path: "profile",
                  element:<Profile></Profile>
                 },{
                  path: "addproject",
                  element:<AddProject/>
                 }


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
              {
                path:'profile',
                element:<Profile/>
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
                children: [{ index: true, element: <TeamMember /> },
                {
                  path: "profile",
                  element: <Profile />
                }],
              },
            ],
          },
        ],
      },
    ],
  },
]);
