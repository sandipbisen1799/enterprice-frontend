import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signAPI, verifyuserAPI } from "../services/user.service.js";
import Navbar from "../components/Navbar.jsx";
import { toast } from 'react-toastify';
import { useApi } from "../context/contextApi.jsx";
import { Loader2 } from "lucide-react";

function Signup() {
  const { setUser, setIsLogin, user } = useApi();
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    userName: "",
    accountType: "teamMember",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState('');
  const [verify, setverify] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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
      const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /[A-Za-z\d]{3,}/;

      if (!userNameRegex.test(formdata.userName)) {
        setError("Username must be at least 3 characters and alphanumeric/underscore");
        setLoading(false);
        return;
      }
      if (!emailRegex.test(formdata.email)) {
        setError('Invalid email address');
        setLoading(false);
        return;
      }
      if (!passwordRegex.test(formdata.password)) {
        setError('Password must be at least 3 characters');
        setLoading(false);
        return;
      }

      const res = await signAPI(formdata);
      if (res.data?.success || res.success) {
        localStorage.setItem('token', res.data?.token || res.token);
        setUser(res?.data?.user || res?.user);
        setIsLogin(true);
        setverify(true);
        toast.success("Account created successfully! Please verify your email with the OTP sent.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Registration failed!";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (event) => {
    event.preventDefault();
    setOtpLoading(true);
    setError("");
    try {
      const email = user?.email;
      const otpRegex = /^\d{4}$/;
      if (!otpRegex.test(otp)) {
        setError('Invalid OTP code (should be a 4-digit number)');
        setOtpLoading(false);
        return;
      }
      const form = { otp, email };
      const res = await verifyuserAPI(form);
      if (res.data?.success || res.success) {
        setverify(false);
        toast.success("Account verified successfully!");

        if (user?.accountType === "teamMember" || user?.accountType === "user") {
          navigate("/user/lobby");
        } else if (user?.accountType === "admin") {
          navigate("/admin");
        } else {
          navigate("/user/lobby");
        }
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0] || err.message || "Verification failed!";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Side - Signup Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
            <form onSubmit={verify ? handleVerifyUser : submitHandler} className="flex flex-col gap-5">
              
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {verify ? "Verify Account" : "Create Account"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {verify 
                    ? `We sent a verification code to ${user?.email || "your email"}` 
                    : "Register to start playing and earning reward vouchers"
                  }
                </p>
              </div>

              {/* Error Box */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 py-3 px-4 rounded-xl text-center text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {verify ? (
                /* OTP CODE VIEW */
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="otp" className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase tracking-wide">
                      Verification OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={otpLoading}
                      maxLength={4}
                      placeholder="Enter 4-digit code"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-center tracking-widest text-lg font-bold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="btn-premium w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Confirm & Verify"
                    )}
                  </button>
                </div>
              ) : (
                /* REGULAR REGISTRATION VIEW */
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="userName" className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase tracking-wide">
                      Username
                    </label>
                    <input
                      id="userName"
                      type="text"
                      name="userName"
                      value={formdata.userName}
                      onChange={changeHandler}
                      disabled={loading}
                      placeholder="choose_username"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                      required
                    />
                  </div>

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
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="password" className="text-xs font-bold text-slate-650 dark:text-slate-300 uppercase tracking-wide">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formdata.password}
                      onChange={changeHandler}
                      disabled={loading}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/15 transition-all text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-premium w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      "Create Free Account"
                    )}
                  </button>
                </div>
              )}

              <div className="text-center text-slate-500 dark:text-slate-400 text-xs mt-2 font-medium">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="text-primary dark:text-indigo-400 font-bold hover:underline"
                >
                  Login instead
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
                Challenge. Win. Redeem.
              </h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Connect your account to play multiplayer matches, earn achievements, collect game tokens, and trade them directly for real vouchers and coupons.
              </p>
              
              <div className="mt-8 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
