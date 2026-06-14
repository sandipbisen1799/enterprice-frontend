import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Rootlayout from "../layouts/Rootlayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { RoleRoute } from "./RoleRouter";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminPage from "../pages/auth/AdminDashboard";
import AdminUsers from "../pages/auth/AdminUsers";
import AdminWithdrawals from "../pages/auth/AdminWithdrawals";
import AdminTournaments from "../pages/auth/AdminTournaments";
import AdminRewardStore from "../pages/auth/AdminRewardStore";
import AdminFraudReport from "../pages/auth/AdminFraudReport";
import UserLayout from "../layouts/UserLayout";
import UserLobby from "../pages/UserLobby";
import UserGameConsole from "../pages/UserGameConsole";
import UserWalletHub from "../pages/UserWalletHub";
import UserStoreHub from "../pages/UserStoreHub";
import UserTournamentsHub from "../pages/UserTournamentsHub";
import UserSocialHub from "../pages/UserSocialHub";
import UserLeaderboardHub from "../pages/UserLeaderboardHub";
import Contactus from "../pages/Contact-us";    

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
                children: [
                  { index: true, element: <AdminPage /> },
                  { path: "users", element: <AdminUsers /> },
                  { path: "withdrawals", element: <AdminWithdrawals /> },
                  { path: "tournaments", element: <AdminTournaments /> },
                  { path: "rewards", element: <AdminRewardStore /> },
                  { path: "fraud", element: <AdminFraudReport /> },
                  { path: "profile", element: <Profile /> }
                ],
              },
            ],
          },

          {
            element: <RoleRoute allowedRoles={["user"]} />,
            children: [
              {
                path: "user",
                element: <UserLayout />,
                children: [
                  { index: true, element: <UserLobby /> },
                  { path: "lobby", element: <UserLobby /> },
                  { path: "game/:gameId", element: <UserGameConsole /> },
                  { path: "wallet", element: <UserWalletHub /> },
                  { path: "store", element: <UserStoreHub /> },
                  { path: "tournaments", element: <UserTournamentsHub /> },
                  { path: "social", element: <UserSocialHub /> },
                  { path: "leaderboard", element: <UserLeaderboardHub /> },
                  { path: "profile", element: <Profile /> }
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
