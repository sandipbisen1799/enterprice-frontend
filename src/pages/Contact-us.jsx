import React from "react";
import Navbar from "../components/Navbar";
import { ArrowLeft, ArrowRight, Mail,Phone } from "lucide-react";

function Contactus() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E8E8E8] w-full   md:py-12  md:px-24 flex flex-col justify-between  items-center">
        <div className="w-full md:h-132 p-12  rounded-2xl flex flex-col md:flex-row gap-y-10   bg-[#F5F6F8] ">
          <div className="  w-full md:w-1/2 h-full  flex flex-col justify-evenly text-left">
            <div>
              <h1 className="text-gray-400 capitalize font-medium text-sm"> we're here to help you</h1>
              <h1 className="w-2/3 capitalize text-gray-800 text-4xl"><span>discuss</span> your chemical solution needs</h1>
            </div>
            <div>
              <h1 className="text-gray-400 capitalize font-medium text-sm">
                are looking for top quality software solution tailored to your
                needs? reach out to us
              </h1>
            </div>
            <div className="flex flex-col  gap-1">
              <Mail />{" "}
              <div className="flex flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">email</h1>
                <h1>sandipbisen1799@gmail.com</h1>
              </div >
              <Phone />{" "}
              <div className="flex flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">Phone</h1>
                <h1>9755149009</h1>
              </div>
            </div>
          </div>
          <div className="  w-full md:w-1/2 h-full  p-4 flex flex-col justify-evenly text-left bg-[#FFFFFF] rounded-3xl  border border-gray-50 shadow-xl">
          <form action="" className="w-full h-full flex flex-col gap-2 ">
            <label htmlFor="name" className="flex w-full h-full gap-1  flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">name</h1>
             <input className=" textarea w-full  h-9 p-1  outline-none  border border-gray-200 bg-[#FFFFFF] font-normal rounded-sm" type="text" name="name" placeholder="javen Smith" id="" />
            </label>
             <label htmlFor="email" className="flex w-full h-full gap-1  flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">email</h1>
             <input className=" textarea w-full  h-9 p-1  outline-none  border border-gray-200 bg-[#FFFFFF] font-normal rounded-sm" type="email" name="email" placeholder="javen.former.com" id="" />
            </label>
             <label htmlFor="industry" className="flex w-full h-full gap-1  flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">industry</h1>
             <select name="cars" id="cars" className=" textarea w-full  h-9 p-1  outline-none  border border-gray-200 bg-[#FFFFFF]  font-normal rounded-sm">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi" className="rounded-b-2xl">Audi</option>
</select>
            </label>
             <label htmlFor="message" className="flex w-full h-full gap-1  flex-col">
                <h1 className="text-gray-400 capitalize font-medium text-sm">message</h1>
             <textarea className=" min-h-16 textarea w-full  h-9 p-1  outline-none  border border-gray-200 bg-[#FFFFFF] font-normal rounded-sm" type="text" name="name" placeholder="javen Smith" id="" />
            </label>
            <button className=" w-1/2 py-2 bg-[#0071EA] rounded-2xl  flex flex-row  items-center justify-around"> 
                 <div className=" bg-white rounded-full  "> <ArrowRight size={28} color="#0071E3"/></div>
                <h1 className="text-white">Get a Solution</h1>
            </button>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contactus;
