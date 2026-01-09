import React, { useEffect, useState } from "react";
import { useApi } from "../context/contextApi";
import { deleteUser, getUserById } from "../services/user.service";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";
function Profile() {
    const {setUser,user}= useApi();
    const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     // ✅ STOP until user exists
//     if (!user?._id) return;

//     const fetchuser = async () => {
//       try {
//         const data = await getUserById(user._id);
//         console.log("Fetched user:", data.user);
//         setProfile(data.user);
//       } catch (error) {
//         console.log(error.response?.data || error.message);
//       }
//     };

//     fetchuser();
//   }, [user]);

//   // optional debug
//   useEffect(() => {
//     console.log("Profile state:", profile);
//   }, [profile]);


//   if (!profile) return <p>Loading...</p>;
//   const deleteuser = async ()=>{
//     try {
//         const res= await deleteUser(user._id)

//         console.log(res)
//         if(res  ){
//             setUser(null)
//             navigate('/login')
//         }
//     } catch (error) {
//        console.log(error) 
//     }


  //}
    const updateuser = async ()=>{

   }
   const deleteUser= async()=>{

   }

  return (<><Navbar/>
    <div className="flex flex-col gap-y-6 justify-between items-center  ">
      <h1 className="text-center text-2xl text-gray-800 font-semibold">Profile details</h1>
      <div className="flex flex-col w-1/2   bg-gray-100 shadow-lg rounded-2xl items-center gap-y-6 p-5 text-gray-700 font-semibold">
        <p>Name: {user.userName}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.accountType}</p>
       <div className="flex flex-row gap-5 ">
             <button className=" px-6 rounded-lg py-2 bg-yellow-300 hover:bg-yellow-500" onClick={updateuser}>update user
            </button>
      <button className=" px-6 rounded-lg py-2 bg-red-300 hover:bg-red-500" onClick={deleteUser}>delete User</button>
       </div>
      </div>
      
    </div>
    </>
  );
}

export default Profile;
