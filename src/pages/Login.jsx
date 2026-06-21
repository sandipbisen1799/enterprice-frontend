import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../services/user.service.js";
import { toast } from 'react-toastify';
import { useApi } from "../context/contextApi.jsx";
import Navbar from "../components/Navbar.jsx";
import { Loader2 } from "lucide-react";

function Login() {
  const { setUser, setIsLogin } = useApi();
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
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
    setError("");
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /[A-Za-z\d]{3,}/;

      if (!emailRegex.test(formdata.email)) {
        setError("Invalid email format");
        setLoading(false);
        return;
      }

      if (!passwordRegex.test(formdata.password)) {
        setError("Password should be at least 3 characters");
        setLoading(false);
        return;
      }

      const res = await loginAPI(formdata);
      if (res.data.success || res.success) {
        const token = res.data.token || res.data.data?.token || res.token;
        localStorage.setItem("token", token);
        const userData = res.data?.user || res.data.data?.user || res.user;
        if (userData) {
          userData.accountType = userData.role === 'superadmin' ? 'admin' : 'user';
          userData.userName = userData.name;
        }
        setUser(userData);
        setIsLogin(true);
        toast.success("Login successful ✅");

        if (userData && userData.accountType === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Login failed";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900 transition-all">
          
          {/* Left Side - Form Pane */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
            <form onSubmit={submitHandler} className="flex flex-col gap-6">
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Enter your credentials to access the Play Console
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="email" className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formdata.email}
                    onChange={changeHandler}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                    placeholder="name@domain.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase tracking-wide">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-semibold text-primary dark:text-indigo-400 hover:underline transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formdata.password}
                    onChange={changeHandler}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 py-3 px-4 rounded-xl text-center text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login to Console"
                )}
              </button>

              <div className="text-center text-slate-500 dark:text-slate-400 text-xs mt-2 font-medium">
                New to Mastermind?{" "}
                <Link
                  to="/signup"
                  className="text-primary dark:text-indigo-400 font-bold hover:underline"
                >
                  Create free account
                </Link>
              </div>
            </form>
          </div>

          {/* Right Side - Branding Side Panel */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12 text-left relative overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
            
            <div className="text-white max-w-sm relative z-10">
              <h2 className="text-3xl font-black leading-tight mb-4">
                Play & Earn Rewards Instantly.
              </h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Connect with players around the globe, participate in premium hand-cricket tournaments, watch sponsored ads, and trade coins for gift vouchers.
              </p>
              
              <div className="mt-8 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
