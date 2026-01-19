import React from "react";
import { Navigate, Outlet } from "react-router";
import {  useApi } from "../context/contextApi.jsx";
const ProtectedRoute = () => {
 const {user, loading}= useApi();

  if (loading) return <h2>Loading...</h2>;
  

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
