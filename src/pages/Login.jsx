import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  loginAPI,
  
} from "../services/user.service.js";
import { toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";
import { useApi } from "../context/contextApi.jsx";
import Navbar from "../components/Navbar.jsx";

function Login() {
  const { setUser, setIsLogin } = useApi();
  const Navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
 const [error,setError]= useState("");
  const [loading, setLoading] = useState(false);
  function changeHandler(event) {
    const { name, type, checked, value } = event.target;
    setformdata((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /[A-Za-z\d]{3,}/;

        if (!emailRegex.test(formdata.email)) {
    setError("Invalid email");
    return;
  }

  if (!passwordRegex.test(formdata.password)) {
    setError("Weak password");
    return;
  }
setError("");

      const res = await loginAPI(formdata);
      console.log(res.data.success);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data?.user);
        setIsLogin(true);
        toast.success("Login successful ✅");

      }
      if (res.data.user.accountType == "teamMember") Navigate("/teamMember");
      else if (res.data.user.accountType == "admin") {
        Navigate("/admin");
      } else {
        Navigate("/projectmanager");
      }
    } catch (error) {
      console.log(error);
      toast.error(  error.response.data.message ,"Something went wrong ❌");
      setError(error.response?.data?.message || "Login failed");

    }
  };

  return (
<>
      <Navbar />

      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-gray-100 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Left - Form */}
          <div className="w-full md:w-5/12 lg:w-1/3 bg-white p-6 md:p-10 flex flex-col justify-center">
            <form
              onSubmit={submitHandler}
              className="flex flex-col gap-5 md:gap-6"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                <span className="text-[#7455da]">Login</span> to your account
              </h1>

              <label htmlFor="email" className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium">Email</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formdata.email}
                  onChange={changeHandler}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7455da] focus:ring-2 focus:ring-[#7455da]/30 transition"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label htmlFor="password" className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium">Password</span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formdata.password}
                  onChange={changeHandler}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7455da] focus:ring-2 focus:ring-[#7455da]/30 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
                <a
                  href="#"
                  className="text-[#7455da] hover:text-[#5a3fc2] hover:underline transition"
                >
                  Forgot password?
                </a>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="bg-[#7455da] text-white py-3 rounded-lg font-medium hover:bg-[#5a3fc2] transition transform hover:scale-[1.02] active:scale-100"
              >
                Login
              </button>

              <div className="text-center text-gray-600 text-sm mt-2">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7455da] font-medium hover:text-[#5a3fc2] hover:underline"
                >
                  Create account
                </Link>
              </div>
            </form>
          </div>

          {/* Right - Decorative / Welcome section */}
          <div className="hidden md:flex md:w-7/12 lg:w-2/3 bg-gradient-to-br from-[#7455da] to-[#5a3fc2] items-center justify-center p-10 lg:p-16">
            <div className="text-white text-center max-w-md">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                Welcome Back!
              </h2>
              <p className="text-lg lg:text-xl opacity-90">
                We're glad to see you again. Log in to continue your journey with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
