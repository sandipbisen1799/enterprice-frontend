import React, { useEffect, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  handleunblockUserAPI,
  updateUser,
} from "../services/user.service";
import { useNavigate } from "react-router";
import { Eye, EyeOff, UserRoundPen, Trash, ShieldUser } from "lucide-react";

import CreateProjectManager from "../components/CreateProjectManager";
import UpdateProjectManager from "../components/UpdateProjectManager";
import AssignProject from "../components/AssignProject";
import { useApi } from "../context/contextApi";
import User from "../components/user.jsx";
function Users( {navBar}) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [oneUser, setOneUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    accountType: "teamMember",
    Password: "",
  });
  function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const fetchUsers = async () => {
    try {
        console.log(navBar)
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  const handleDelete = async (user) => {
    try {
      const _id = user._id;
      if (window.confirm(`Are you sure you want to delete ${user.userName}?`)) {
        const res = await deleteUser(_id);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onHandleModify = async () => {
    console.log(formData);
    const _id = userId;
    console.log(formData);
    const data = await updateUser(_id, userId);
    console.log(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const handleunblockUser = async (user) => {
    console.log(user._id);
    const userId = user._id;
    const res = await handleunblockUserAPI(userId);
    fetchUsers();
    console.log(res);
  };

  return (
    <div className="min-h-screen mt-16 bg-[#F7F7F7] p-4 md:p-8 flex flex-col items-center gap-3 ">
      <div className="w-full h-20  justify-between flex flex-row  items-center border-b border-gray-200  ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">
          All User list
        </h1>
        <button
          className="px-6 py-2 hover:scale-101 hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize"
          onClick={() => setIsEditOpen(true)}
        >
          Add Users
        </button>
      </div>

      {/* 
      <div className="w-full bg-white rounded-2xl p-3 shadow-xl   flex flex-col gap-4 "> */}
      {/* {users.length === 0 && (
          <p className="text-center text-gray-600">
            No project managers found.
          </p>
        )} */}
      <table className="bg-gray-100 px-1">
        <thead>
          <tr className="grid grid-flow-col md:grid-flow-row  grid-rows-1 grid-cols-9   h-16 items-center justify-between ">
            <th>index</th>
            <th>userName</th>
            <th className="col-span-2"> email</th>
            <th className="col-span-2"> phone Number</th>
            <th>status</th>
            <th>action</th>
            <th>unblocking</th>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-3  ">
          {users.map((user, index) => (
            <tr key={user._id}>
              <div className="grid  grid-flow-col gap-x-7 md:grid-flow-row items-center  grid-rows-1 h-12 p-6  bg-gray-200  grid-cols-10 gap-y-2 justify-start ">
                <td>{index}</td>
                <td> {user.userName}</td>
                <td className="w-full col-span-3 ">{user.email}</td>
                <td className="w-full col-span-2">9755149009</td>
                <td>{user.active}</td>
                <td className="w-16 flex flex-row ">
                  <ShieldUser
                    className="cursor-pointer"
                    onClick={() => {
                      setOneUser(true);
                    }}
                  />
                  <UserRoundPen
                    className="cursor-pointer"
                    onClick={() => {
                      setModify(true);
                      setUserId(user._id);
                    }}
                  />
                  <Trash
                    className="cursor-pointer"
                    onClick={() => handleDelete(user)}
                  ></Trash>{" "}
                </td>

                <td className="">
                  {user.active === "block" && (
                    <div onClick={() => handleunblockUser(user)}>
                      <button className="bg-green-200 cursor-pointer px-4 rounded-lg hover:bg-green-300">
                        {" "}
                        unblock user
                      </button>
                    </div>
                  )}
                </td>
              </div>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {users.map((user,index ) => (
          <div key={user._id} className="flex flex-row gap-y-2    ">
         
            <div className="  w-full  rounded-xl   p-6 flex flex-col md:flex-row justify-between  gap-3">
              <div className="flex  w-full  items-start md:items-center  flex-col gap-y-2  md:flex-row  justify-between">
                  <div className="flex flex-col w-8">
                  <p className="font-medium text-gray-900">{index }</p>
                </div>
                <div className="flex flex-col w-40">
                  <p className="font-medium text-gray-900">{user.userName}</p>
                </div>

                <div className=" w-72 ">
                  <p className="text-gray-800 break-all">{user.email}</p>
                </div>
                <div className=" w-36 ">
                  <h1>7809599494</h1>
                </div>
                <div className=" w-36 ">
                  <h1  >{user.active}</h1>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-2 w-16 ">
              <ShieldUser className="cursor-pointer" onClick={()=>{setOneUser(true)}} />
                <UserRoundPen
                className="cursor-pointer" 
                  onClick={() => {
                    setModify(true);
                    setUserId(user._id);
                  }}
                />

                
              </div>
              <div onClick={()=>handleunblockUser(user)}>{user.active === 'block' && <div ><button className="bg-green-200 px-4 rounded-lg hover:bg-green-300" > unblock user</button></div>}</div>
              
            
              </div>
            </div>
          
        ))} */}
      {/* </div> */}
      {oneUser && <User userId={userId} onClose={() => setOneUser(false)} />}
      {modify && (
        <>
          {" "}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setModify(false)}
          />
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            <h2 className="text-xl font-bold mb-4">update the user details </h2>

            <label className="flex flex-col w-full  " htmlFor="userName">
              <h1>Username</h1>
              <input
                placeholder="update the UserName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handlechange}
                className="border p-2 w-full mb-4"
              />
            </label>
            <label className="flex flex-col w-full" htmlFor="email">
              <h1>email</h1>
              <input
                placeholder="update the discription"
                type="email"
                name="email"
                value={formData.email}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              />
            </label>
            <label className="flex flex-col w-full" htmlFor="accountType">
              <h1>accountType</h1>
              <select
                placeholder="update the accountType"
                type="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              >
                <option value="TeamMember">TeamMember</option>
                <option value="admin">admin</option>
                <option value="teamManager">TeamManager</option>
              </select>
            </label>

            {showPassword ? (
              <label className="flex  flex-col w-full" htmlFor="text">
                <h1>Password</h1>
                <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
                  <input
                    placeholder=" password"
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handlechange}
                    className=" p-2  w-full mb-4 outline-none "
                  />
                  <div
                    className="text-center  place-items-center   "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeOff />
                  </div>
                </div>
              </label>
            ) : (
              <label className="flex  flex-col w-full" htmlFor="text">
                <h1>Password</h1>
                <div className="w-full flex border h-12 mb-4  flex-row items-center text-center ">
                  <input
                    placeholder=" password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handlechange}
                    className=" p-2  w-full mb-4 outline-none "
                  />
                  <div
                    className="text-center  place-items-center   "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye />
                  </div>
                </div>
              </label>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModify(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={onHandleModify}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Update the user
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;
