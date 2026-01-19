import { Api } from "../context/contextApi.jsx"; 
import { useContext } from "react";
import React from "react";
import { Navigate, Outlet } from "react-router";
 export const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(Api);

  if (loading) return <p>Loading...</p>;
  
  
  const token = localStorage.getItem("token");
  if(!token){
  return <Navigate to="/login" />
  }
  if (!allowedRoles.includes(user?.accountType))
   {if(user.accountType == 'admin'){
          return <Navigate to='/admin'/>

    }
  else if(user.accountType == 'teamMember'){
    return <Navigate to='teamMember'/>
  }
  else{
    return <Navigate to= 'teamMember'/>
  }
  };
 
  return <Outlet />;
};
