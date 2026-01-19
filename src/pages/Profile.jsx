import React, { useState } from "react";
import Button from "../components/ui/Button";
import profileimage from "../assets/images/laptop.png";
import { Share } from "lucide-react";
import { useApi } from "../context/contextApi";
import { reverifyuserAPI, verifyuserAPI } from "../services/user.service";
import { toast } from 'react-toastify';

function Profile() {

  const {user,checkAuth} = useApi();
  const [otpInput ,setOtpInput] = useState(false);

  const [formData, setFormData] = useState({ otp: "" });
    function changeHandler(event) {
    const { name, type, checked, value } = event.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));}
  const handleverify= async ()=>{
    try {
      const email ={ email: user.email} ;
      const data = await reverifyuserAPI(email);
      console.log(data);
      if(data?.data.success){
      setOtpInput(true)
      toast.success("OTP sent to your email!");
    }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    }
  }
  const handleverifyuser = async ()=>{
  try {
      const form ={
        email :user.email,
        otp:formData.otp
      }
      const data = await verifyuserAPI(form);
  console.log(data);
      setOtpInput(false);
     checkAuth();
     toast.success("Account verified successfully!");
    
  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || "Verification failed!");

  }
  }
  
  return (
   <div className="min-h-screen px-5 bg-[#F7F7F7] flex flex-col gap-3 ">
     <div className="w-full h-20 justify-between flex flex-row items-center ">
       <h1 className="text-2xl font-bold capitalize text-gray-800">Profile</h1>
     </div>
      <div className="flex px-4 flex-col gap-y-2 border-b-2 py-4  border-gray-200 ">
        <div className="flex flex-row justify-items-start   gap-6 ">
          <div className="w-36 h-36 overflow-hidden  flex justify-start border-2 border-gray-300 p-3 rounded-full">
            <img
              src={profileimage}
              className="inset-0  w-full h-full"
              alt="fg"
            />
          </div>
          <div className="flex flex-col justify-between items-left p-3 gap-2.5 ">
            <h1 className="font-semibold text-black text-lg capitalize ">
              Profile picture
            </h1>
            <div className="flex flex-row gap-x-1 ">
              <button className="flex py-2 px-4 text-center items-center text-white capitalize rounded-xl border boreder-gray-200 hover:bg-[#8755ea] bg-[#9B6CF8] cursor-pointer">
                {" "}
                <Share color="#fff" />
                upload image
              </button>
              <button className="flex py-1 px-4 rounded-lg text-center items-center bg-white   capitalize ">
                {" "}
                remove
              </button>
            </div>
            <h1 className="font-semibold text-sm text-gray-400 ">
              we support png jpg anf gif under 10 mb{" "}
            </h1>
          </div>
        </div>
        <div className="w-full h-full flex gap-5  flex-col  ">
          <div className="flex flex-row gap-5 w-full ">
            <label
              className="flex w-full flex-col capitalize gap-1 text-gray-600 font-medium"
              htmlFor="name"
            >
              <h1>userName</h1>
              <input
                type="text"
                placeholder={`${user.userName}`}
                className="w-full text-black py-2 placeholder:px-5 outline-none border-2 rounded-xl border-gray-200"
              />
            </label>
            <label
              className="flex flex-col w-full capitalize gap-1 text-gray-600 font-medium"
              htmlFor="email"
            >
              <h1>email</h1>
              <input
                placeholder={`${user.email}`}
                type="email"
                className="w-full text-black placeholder:px-5 py-2 outline-none border-2 rounded-xl border-gray-200"
              />
            </label>
          </div>
          <div className="flex flex-row gap-5 w-full ">
            <label
              className="flex w-full flex-col capitalize gap-1 text-gray-600 font-medium"
              htmlFor="name"
            >
              <h1>accountType</h1>
              <input
                type="text"
                placeholder={`${user.accountType}`}
                className="w-full text-black py-2 placeholder:px-5 outline-none border-2 rounded-xl border-gray-200"
              />
            </label>
            <label
              className="flex w-full flex-col capitalize gap-1 text-gray-600 font-medium"
              htmlFor="name"
            >
              <h1>phoneNumber</h1>
              <input
                type="text"
                placeholder={`9755149009`}
                className="w-full text-black py-2 placeholder:px-5 outline-none border-2 rounded-xl border-gray-200"
              />
            </label>
            
          </div>
          <h1 className="font-semibold text-sm text-gray-400 ">
              used to log in into your account{" "}
            </h1>
          {
            otpInput &&(
              <>
                <div className=" h-full flex flex-col items-center gap-5 ">
                  <h1 className="font-semibold text-sm text-gray-800">enter the otp to verify the user</h1>
                  <label htmlFor="otp"   >
                      <input type="otp" name="otp" onChange={changeHandler} value={formData.otp} placeholder="enter the otp"  className="w-full  border-b-2 outline-none border-gray-600  "  />
                      
                  </label>
                    <>
                <button className="px-10 py-2 border-2 bg-[] border-gray-200 font-semibold text-sm cursor-pointer capitalize rounded-lg hover:bg-[#8755ea] bg-[#9B6CF8] text-white" onClick={handleverifyuser}>
          verify the user{" "}
        </button>


              </>
                
                </div>
              </>
            )
          }
    
            { !otpInput && ( !user.isVerified  &&  (
              <>
                <button className="px-8 py-2 border-2 bg-[] border-gray-200 font-semibold text-sm cursor-pointer capitalize rounded-lg hover:bg-[#8755ea] bg-[#9B6CF8] text-white" onClick={handleverify}>
          verify the user{" "}
        </button>
              </>
            ))}
        </div>
      </div>
      <div className="flex px-4 flex-col gap-y-2 justify-between border-b-2 py-4   border-gray-200 ">
        <div className="w-full h-full flex flex-row gap-5  justify-between  ">
          <div className="flex  flex-col gap-1 justify-between ">
            <h1 className="font-semibold text-lg capitalize">password</h1>
            <h1 className="font-semibold text-sm text-gray-400 ">
              login with your password{" "}
            </h1>
          </div>
          <div>

            <button className="px-4 py-2 border-2 border-gray-200 font-semibold text-sm text-gray-800 capitalize rounded-lg " >
              {" "}
              change password
            </button>
          </div>
        </div>
      </div>
      <div className=" flex flex-row justify-end gap-2 px-4 ">
        <button className="px-8 py-2 border-2 border-gray-200 font-semibold text-sm cursor-pointer text-gray-800 capitalize rounded-lg ">
          {" "}
          Cancel
        </button>
        <button className="px-8 py-2 border-2 bg-[] border-gray-200 font-semibold text-sm cursor-pointer capitalize rounded-lg hover:bg-[#8755ea] bg-[#9B6CF8] text-white">
          save{" "}
        </button>
      </div>
      {/* {
        passwordButton && (
          <>
             <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setModify(false)}
          />
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            
          
           </div> 
            </>
        )
      } */}

      {/* <Button variant='success' size='sm' className='' >
        add user
      </Button> */}
    </div>
  );
}

export default Profile;
