import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { signAPI,verifyuserAPI } from "../services/user.service.js";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import { toast } from 'react-toastify';
import { useApi } from "../context/contextApi.jsx";


function Signup() {
const {setUser ,setIsLogin,user} = useApi();
  const Navigate = useNavigate();
  const [formdata, setformdata] = useState({
    userName: "",
    accountType: "teamMember",
    email: "",
    password: "",
  });
  const [otp ,setOtp]= useState('');
  const [verify ,setverify]= useState(false);
    const [error,setError]= useState("");
  
  function changeHandler(event) {
    const { name, type, checked, value } = event.target;
    setformdata((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
    
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /[A-Za-z\d]{3,}/;
      if (!userNameRegex.test(formdata.userName)) {
        setError("Invalid username");
        return;
      }
      if(!emailRegex.test(formdata.email)){
        setError('Invalid email');
        return;
      }
      if(!passwordRegex.test(formdata.password)){
        setError('Weak password');
        return;
      }
      setError('')
      const res = await signAPI(formdata);
      console.log(res.data.token);
      if(res.data?.success){
        localStorage.setItem('token',res.data?.token)
         setUser(res?.data?.user);
         setIsLogin(true)
         setverify(true)
         toast.success("Account created successfully! Please verify your email with OTP.");
      }
   
     
      
    
    } catch (error) {
     console.log(error);
     toast.error(error.response?.data?.message || "Verification failed!");
    }
  };
     const handleVerifyUser = async (event)=>{
 try {
       event.preventDefault()
       
         const email = user.email;
      const otpRegex = /^\d{4}$/;
      if(!otpRegex.test(otp)){
        setError('Invalid Otp')
        return;
      }
         const form = {
           otp,email
         }
          const res = await verifyuserAPI(form)
          console.log(res)
          if(res.data?.success){
           setverify(false);
           toast.success("Account verified successfully!");



         if (user.accountType== "teamMember") Navigate("/teamMember");
       else if (user.accountType == "admin") {
         Navigate("/admin");
       } else {
         Navigate("/projectmanager");
       }}
 } catch (error) {
  console.log(error?.response?.data?.errors)
   console.log(error);
   toast.error(error.response?.data?.message || error?.response?.data?.errors?.[0] || "Something went wrong!");
 }
    
      }
  return (
   <>
      <Navbar />

      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-gray-100 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Left - Form */}
          <div className="w-full md:w-5/12 lg:w-1/3 bg-white p-6 md:p-10 flex flex-col justify-center">
            <form className="flex flex-col gap-5 md:gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                <span className="text-[#7455da]">Create</span> your account
              </h1>

              <label htmlFor="userName" className="flex flex-col gap-1.5">
                <span className="text-gray-700 font-medium">Username</span>
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  value={formdata.userName}
                  onChange={changeHandler}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7455da] focus:ring-2 focus:ring-[#7455da]/30 transition"
                  placeholder="yourusername"
                  required
                />
              </label>

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
                  autoComplete="new-password"
                  required
                />
              </label>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-center text-sm">
                  {error}
                </div>
              )}

              {/* OTP Verification Section */}
              {verify ? (
                <>
                  {!user?.isVerified ? (
                    <div className="space-y-4">
                      <label htmlFor="otp" className="flex flex-col gap-1.5">
                        <span className="text-gray-700 font-medium">
                          Enter OTP
                        </span>
                        <input
                          type="text"
                          name="otp"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter the OTP sent to your email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7455da] focus:ring-2 focus:ring-[#7455da]/30 transition"
                          maxLength={6}
                          required
                        />
                      </label>

                      <button
                        type="button"
                        onClick={(event) => handleVerifyUser(event)}
                        className="bg-[#7455da] text-white py-3 rounded-lg font-medium hover:bg-[#5a3fc2] transition transform hover:scale-[1.02] active:scale-100 w-full"
                      >
                        Verify OTP
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => submitHandler(event)}
                      className="bg-[#7455da] text-white py-3 rounded-lg font-medium hover:bg-[#5a3fc2] transition transform hover:scale-[1.02] active:scale-100 w-full"
                    >
                      Create Account
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={(event) => submitHandler(event)}
                  className="bg-[#7455da] text-white py-3 rounded-lg font-medium hover:bg-[#5a3fc2] transition transform hover:scale-[1.02] active:scale-100 w-full"
                >
                  Create Account
                </button>
              )}

              <div className="text-center text-gray-600 text-sm mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#7455da] font-medium hover:text-[#5a3fc2] hover:underline"
                >
                  Login here
                </Link>
              </div>
            </form>
          </div>

          {/* Right - Decorative Section */}
          <div className="hidden md:flex md:w-7/12 lg:w-2/3 bg-gradient-to-br from-[#7455da] to-[#5a3fc2] items-center justify-center p-10 lg:p-16">
            <div className="text-white text-center max-w-md">
              <h2 className="text-xl lg:text-2xl font-bold mb-6">
                Join Us Today!
              </h2>
              <p className="text-lg lg:text-2xl opacity-90">
                Create your account and start exploring something amazing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
