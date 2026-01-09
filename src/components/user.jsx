
import { useEffect, useState } from "react";
import React from "react";
import { getUserById  } from "../services/user.service";

 
function User({ onClose, userId }) {

      const [user, setUser] = useState({
      id: null,
      userName: '',
      email: '',
      accountType: 'null',

    });

      
      const fetchProject = async () => {
        try {
     const _id =userId
      const res= await getUserById(_id);  
      console.log(res);
      setUser(res.data.user)

        
    } catch (error) {
      console.error(error.response?.data?.message);
    }}
          
     
    useEffect(() => {
       fetchProject();
     }, []);
      
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96">

    <div className="w-full h-full p-4 flex flex-col gap-2 ">
        <div className="flex w-full place-content-center  items-center"><h1 className="text-center text-2xl capitalize text-gray-900 font-semibold">user Data</h1></div>
        <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
            <h1>name</h1>
            <h1>{user.userName}</h1>
        </div>
          <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
            <h1>email</h1>
            <h1>{user.email}</h1>
        </div>
          <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
            <h1>accountType</h1>
            <h1>{user.accountType}</h1>
        </div>
        </div>      
     
 
      
        
      </div>
    </>
  );
}


export default User;