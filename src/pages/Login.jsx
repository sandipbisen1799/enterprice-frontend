import React from "react";
 import { useState } from "react";
import { Link } from "react-router";
import { loginAPI, resenduserAPI, verifyuserAPI } from "../services/user.service.js";
import { useNavigate } from "react-router";
import {  useApi } from "../context/contextApi.jsx";
import Navbar from "../components/Navbar.jsx";


function Login() {
  const [resend, setresend] =useState(false)
  const {setUser,setIsLogin ,user, checkAuth}= useApi();
  const  Navigate=useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
    otp : ''
  });

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
      const res = await loginAPI(formdata);
      console.log(res.data.success);
      ifres.data.success){
      localStorage.setItem("token", res.data.token);
      setUser(res.data?.user);
     setIsLogin(true)
        
      }
     if(res.data.user.accountType =='teamMember')
      Navigate('/teamMember')
     else if(res.data.user.accountType =='admin') 
{
  Navigate('/admin')
}else{
  Navigate('/projectmanager')
}


    } catch (error) {
      console.log(error);
    }
  };
  const handleverify = async (event)=>{
    try {
event.preventDefault();
      const email = user.email ;
      const data =  await resenduserAPI(email);
      if(data?.data?.success){
        setresend(true)
      }

    } catch (error) {
      console.log(error)
    }

  }
  const handlereverify = async (event)=>{
event.preventDefault();
const email = user.email ;
const res = await verifyuserAPI(email)
   if(res.data?.success){
          setresend(false);
          checkAuth();

        if (res.data.user.accountType == "teamMember") Navigate("/teamMember");
      else if (res.data.user.accountType == "admin") {
        Navigate("/admin");
      } else {
        Navigate("/projectmanager");
      }}
  }

  return (
    <> <Navbar></Navbar>
    <div className="bg-[#7455daa5] h-full w-full py-32 px-4 md:py-16 md:px-12 lg:py-8 lg:px-32 flex justify-center relative">
      {/* <div className="absolute w-28  h-8 rounded-lg bg-white/50 border-blue/40 top-2 left-2  flex items-center font-semibold  justify-center text-white cursor-pointer "> 
      <h1>back to home </h1></div> */}
   
      <div className="w-full lg:w-1/3 h-full bg-gray-100 rounded-2xl   flex flex-col justify-center items-center  py-8  shadow-2xl px-4">
        <form onSubmit={submitHandler} className="flex flex-col justify-center items-center gap-y-3 lg:gap-y-6 ">
          <h1 className="text-2xl">
            <span className="text-[#7455daa5] font-semibold ">Login</span> your
            account
          </h1>
          <label htmlFor="email" className="flex flex-col text-left w-full ">
            Email
            <input
              type="email"
              name="email"
              id="email"
              value={formdata.email}
              onChange={changeHandler}
              className="w-full  border-b-2 outline-none border-gray-600"
            />
          </label>
          <label htmlFor="password" className=" w-full ">
            Password
            <input
            autoComplete=""
              type="password"
              name="password"
              id="password"
              onChange={changeHandler}
              value={formdata.password}
              className="w-full  border-b-2 outline-none border-gray-600  "
            />
          </label>
          <div className="flex justify-betweeen items-center w-full">
            {!user.isverified && (

               <button onClick={()=>handleverify(event)}>verify user</button>
            ) }
          
            
            <h1 className="text-[#7455daa5] hover:text-[#7455daa5] cursor-pointer">
              forget password?
            </h1>
          </div>
          {resend ? ( <>
              <label htmlFor="otp" >
                      <input type="otp" name="otp" onChange={changeHandler} value={formdata.otp} placeholder="enter the otp"  className="w-full  border-b-2 outline-none border-gray-600  "  />
                      
                  </label>
          <button onClick={()=>handlereverify(event)} className="bg-[#7455daa5] w-full py-1 rounded-sm cursor-pointer text-white hover:bg-[#7455da]">
            submit 
          </button>
          </> ):
          (
             <button className="bg-[#7455daa5] w-full py-1 rounded-sm cursor-pointer text-white hover:bg-[#7455da]">
            login
          </button>
          )}
        
          <div>
            <Link
              to="/signup"
              className="text-[#7455daa5] hover:text-[#7455da] mt-3  "
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
