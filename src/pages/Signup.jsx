import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { signAPI,verifyuserAPI } from "../services/user.service.js";
import { useNavigate } from "react-router";
import { useApi } from "../context/contextApi.jsx";
import Navbar from "../components/Navbar.jsx";
  

function Signup() {
  const {user, setUser, setIsLogin,checkAuth } = useApi();
  const Navigate = useNavigate();
  const [formdata, setformdata] = useState({
    userName: "",
    accountType: "teamMember",
    email: "",
    password: "",
    otp : ''
  });
  const [verify ,setverify]= useState(false);
  
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
      const res = await signAPI(formdata);
      console.log(res.data.token);
      if(res.data?.success){
        localStorage.setItem('token',res.data?.token)
         setUser(res?.data?.user);
         setIsLogin(true)
         setverify(true)
      }
   
     
      
    
    } catch (error) {
      console.log(error);
    }
  };
     const handleVerifyUser = async (event)=>{
      event.preventDefault()
        const otp =formdata.otp;
        const email = user.email;
     
        const form = {
          otp,email
        }
         const res = verifyuserAPI(form)
         console.log(res)
         if(res.data?.success){
          setverify(false);
          checkAuth();

        if (res.data.user.accountType == "teamMember") Navigate("/teamMember");
      else if (res.data.user.accountType == "admin") {
        Navigate("/admin");
      } else {
        Navigate("/projectmanager");
      }}
    
      }
  return (
    <>
    <Navbar/>
    <div className="bg-[#7455daa5] h-full w-full py-32 px-4 md:py-16 md:px-12 lg:py-8 lg:px-32 flex justify-center">
      <div className="w-full lg:w-1/3 h-full bg-gray-100 rounded-2xl flex flex-col justify-center lg:gap-y-6 gap-y-3  items-center py-8  shadow-2xl px-4">
        <form
         
          className="flex flex-col justify-center items-center gap-y-3 lg:gap-y-6 "
        >
          <h1 className="text-2xl">
            <span className="text-[#7455daa5] font-semibold ">Create</span> your
            account
          </h1>
          <label htmlFor="userName" className="flex flex-col w-full text-left ">
            UserName
            <input
              id="userName"
              type="text"
              value={formdata.userName}
              onChange={changeHandler}
              name="userName"
              className="w-full  border-b-2 outline-none border-gray-600"
            />
          </label>
          <label htmlFor="email" className="flex flex-col w-full text-left ">
            Email
            <input
              value={formdata.email}
              onChange={changeHandler}
              type="email"
              name="email"
              id="email"
              className="w-full  border-b-2 outline-none border-gray-600"
            />
          </label>
          <label
            htmlFor="password"
            value={formdata.password}
            onChange={changeHandler}
            className="flex flex-col text-left w-full "
          >
            Password
            <input
            autoComplete=""
              type="password"
              name="password"
              id="password"
              className="w-full  border-b-2 outline-none border-gray-600  "
            />
          </label>
          <div className="flex justify-end items-center w-full">
            <h1 className="text-[#7455daa5] hover:text-[##7455daa5] cursor-pointer">
              forget password?
            </h1>
          </div>
          <div className="h-full "></div>
        {verify ?(

         <>
              

            <div>
              {
                !user.isVerified ? (<>
                <div className="w-full h-12 ">
                  <label htmlFor="otp" >
                      <input type="otp" name="otp" onChange={changeHandler} value={formdata.otp} placeholder="enter the otp"  className="w-full  border-b-2 outline-none border-gray-600  "  />
                      
                  </label>
                
                </div>
                
               <button onClick={ ()=>handleVerifyUser(event)} className={`bg-[#7455daa5]  w-full px-5 py-1 rounded-sm cursor-pointer  text-white hover:bg-[#7455da]`}>
            verify the user
          </button> </>):(
            <button onClick={()=>submitHandler(event)} className="bg-[#7455daa5] w-full py-1 rounded-sm cursor-pointer  text-white hover:bg-[#7455da]">
            Create the Account
          </button>
          ) }
            </div>
             
           
            </>
          ): ( <button onClick={()=>submitHandler(event)} className="bg-[#7455daa5] w-full py-1 rounded-sm cursor-pointer  text-white hover:bg-[#7455da]">
            Create the Account
          </button>)} 
          <div>
            <Link to="/login" className="text-[#7455daa5]">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Signup;
