import React, { useEffect, useState } from "react";
import {
  addUserAPI,
  deleteUser,
  getAllUsers,
  getUserById,
  handleunblockUserAPI,
  updateUser,
} from "../../services/user.service";

// import { useNavigate } from "react-router";
import { Eye, EyeOff, UserRoundPen, Trash, User, EllipsisVertical } from "lucide-react";
// import { useApi } from "../context/contextApi";
import Table from "../../components/ui/Table";
import { toast } from 'react-toastify';
import TablePagination from "../../components/ui/TablePagination";
import UserMenu from "../../components/UserMenu";
import ConformationBox from "../../components/ConformationBox";
function Users({ navBar }) {
  // const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
  const [menu ,setMenu]= useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [oneUser, setOneUser] = useState(false);
 

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    accountType: "teamMember",
    password: "",
    phoneNumber: "",
  });
  const [user1, setUser1] = useState({
    id: null,
    userName: "",
    email: "",
    accountType: "null",
  });
  function handlechange(event) {
    const { name, type, value, checked } = event.target;
    setFormData((prevFormdata) => ({
      ...prevFormdata,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
const [conformation,setConformation]= useState(false);

  const handleOneuser = async (user) => {
    try {
      const _id = user._id;
      const res = await getUserById(_id);
      setUser1(res.data.user);
      console.log(res);
      setOneUser(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log(navBar);
      const data = await getAllUsers(page,10);
      setUsers(data.users || []);
      setTotalPages(data?.pagination?.totalPages);
      console.log(data);
      
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  const handleDelete = async (user) => {
    try {
      setUserId(user._id);
      setConformation(true);


      
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user!");
    }
  };
  const onHandleModify = async () => {
    try {
      const _id = userId;
      const updatedData = formData;
      const data = await updateUser(_id, updatedData);
      console.log(data);
      fetchUsers();
      setModify(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user!");
    }
  };
  const onHandleAdd = async () => {
    try {
      console.log(formData);
      const data = await addUserAPI(formData);
      console.log(data);
      setIsEditOpen(false);
      fetchUsers();
      toast.success("User added successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add user!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);
  const handleunblockUser = async (user) => {
    try {
      console.log(user._id);
      const userId = user._id;
      const res = await handleunblockUserAPI(userId);
      console.log(res)
      fetchUsers();
      console.log(res);
      toast.success("User unblocked successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to unblock user!");
    }
  };

  const columns = [
  {
    key: "index",
    label: "Index",
    render: (_, index) => index,
  },
  {
    key: "userName",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "active",
    label: "Status",
  },
];
const handleModifyButton = async(user)=>{
  try {
    const _id =user._id;
    const data = await getUserById(_id);
   const userData = data.data.user ;
     setFormData({
      userName: userData.userName || "",
      email: userData.email || "",
      accountType: userData.accountType || "teamMember",
      password: "",
      phoneNumber: userData.phoneNumber || "",
    });
  
      setModify(true);


          setUserId(user._id);
  } catch (error) {
    console.log(error)
  }
}
  return (
    <div  onClick={()=>setMenu(false)} className="min-h-screen px-5   bg-[#F7F7F7]  flex flex-col items-center gap-3 relative  ">
      <div className="w-full h-20  justify-between flex flex-row  items-center  ">
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

      {/* <div className="w-full min-h-56 h-full rounded-lg border border-gray-50 px-4    shadow-lg shadow-gray-200 bg-white flex flex-row md:flex-col  ">
        <div className="hidden md:flex flex-col md:flex-row capitalize text-gray-600/70  font-semibold justify-between h-12  items-center     ">
          <h1 className="w-1/12 text-left">index</h1>
          <h1 className="w-2/12 text-left">name</h1>
          <h1 className="w-3/12 text-left">email</h1>
          <h1 className="w-2/12 text-left">status</h1>
          <h1 className="w-2/12 text-left">action</h1>
          <h1 className="w-2/12 text-left">unblocked</h1>
        </div>
        <div className="w-full h-full flex flex-col ">
          {users.map((user, index) => (
            <div
              className="flex p-3 md:p-0 flex-col w-full md:flex-row capitalize text-gray-700/70  font-semibold  h-full md:h-12 border-t border-gray-200/40  "
              key={user._id}
            >
              <div className="md:w-1/12 w-full text-left min-h-12 md:place-content-center flex  flex-row md:block md:gap-x-1 gap-4   ">
                {" "}
                <h1 className="md:hidden">index</h1>
                {index}
              </div>
              <div className="md:w-2/12 w-full text-left min-h-12 md:place-content-center flex  flex-row md:block md:gap-x-1 gap-4   ">
                <h1 className="md:hidden">name</h1>
                {user.userName}
              </div>
              <div className="w-full md:w-3/12 text-left   min-h-12 md:place-content-center  items-center break-words whitespace-normal flex  flex-row md:block gap-4 md:gap-x-1">
                <h1 className="md:hidden">email</h1>
                <h1>{user.email}</h1>
              </div>
              <div className=" w-full md:w-2/12 text-left min-h-12 md:place-content-center flex gap-4 flex-row md:block md:gap-x-1">
                <h1 className="md:hidden">active</h1>
                {user.active}
              </div>
              <div className=" w-full md:w-2/12 text-left   gap-4 min-h-12  gap-x-4 text-[#705CC7]  items-center flex  flex-row  md:gap-x-1">
                <h1 className="md:hidden text-gray-700/70"> Action</h1>
                <User
                  className="cursor-pointer"
                  onClick={() => handleOneuser(user)}
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
                ></Trash>
              </div>
              <div className=" w-full  md:w-2/12 text-left min-h-12 md:block flex gap-x-3 items-center  md:place-content-center">
                <h1 className="md:hidden">status</h1>
                <button className="px-3 py-1 rounded-2xl bg-[#CEEDD2] text-center text-green-500 flex  flex-row md:block md:gap-x-1">
                  {" "}
                  unblocked
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className=" w-full overflow-x-auto ">
        <table className="min-w-[900px] table-auto min-h-56 h-full w-full border-gray-200/50 border-collapse   rounded-lg border bg-white        shadow-lg shadow-gray-200  ">
          <thead className="  capitalize text-gray-600/70  font-semibold">
            <tr className="  h-12  ">
              <th className="px-4 py-2 text-left">Index</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Unblock</th>

            
            </tr>
          </thead>
          <tbody className="capitalize text-gray-600/70  font-semibold">
            {users.map((user, index) => (
              <tr className=" h-12 border-t border-gray-200/40" key={user._id}>
                <td className="px-4 py-2">{index}</td>
                <td className="px-4 py-2"> {user.userName}</td>
                <td className="  ">{user.email}</td>
                <td>{user.active}</td>

                <td className=" flex pt-2 gap-2 text-[#705CC7] ">
                  <User
                    className="cursor-pointer"
                    onClick={() => handleOneuser(user)}
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

                <td className="" onClick={() => handleunblockUser(user)}>
                  <button className="bg-green-200 cursor-pointer px-2 py-1  rounded-lg hover:bg-green-300">
                    unblock user
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      {/* </div>
       <div className="w-full min-h-56 h-full rounded-lg border border-gray-50 px-4    shadow-lg shadow-gray-200 bg-white flex flex-row md:flex-col  ">
        <div className="hidden md:flex flex-col md:flex-row capitalize text-gray-600/70  font-semibold justify-between h-12  items-center     ">
          <h1 className="w-1/12 text-left">index</h1>
          <h1 className="w-2/12 text-left">name</h1>
          <h1 className="w-3/12 text-left">email</h1>
          <h1 className="w-2/12 text-left">status</h1>
          <h1 className="w-2/12 text-left">action</h1>
          <h1 className="w-2/12 text-left">unblocked</h1>
        </div>
        {/* <div className="w-full h-full flex flex-col ">
          {users.map((user, index) => (
            <div
              className="flex p-3 md:p-0 flex-col w-full md:flex-row capitalize text-gray-700/70  font-semibold  h-full md:h-12 border-t border-gray-200/40  "
              key={user._id}
            >
              <div className="md:w-1/12 w-full text-left min-h-12 md:place-content-center flex  flex-row md:block md:gap-x-1 gap-4   ">
                {" "}
                <h1 className="md:hidden">index</h1>
                {index}
              </div>
              <div className="md:w-2/12 w-full text-left min-h-12 md:place-content-center flex  flex-row md:block md:gap-x-1 gap-4   ">
                <h1 className="md:hidden">name</h1>
                {user.userName}
              </div>
              <div className="w-full md:w-3/12 text-left   min-h-12 md:place-content-center  items-center break-words whitespace-normal flex  flex-row md:block gap-4 md:gap-x-1">
                <h1 className="md:hidden">email</h1>
                <h1>{user.email}</h1>
              </div>
              <div className=" w-full md:w-2/12 text-left min-h-12 md:place-content-center flex gap-4 flex-row md:block md:gap-x-1">
                <h1 className="md:hidden">active</h1>
                {user.active}
              </div>
              <div className=" w-full md:w-2/12 text-left   gap-4 min-h-12  gap-x-4 text-[#705CC7]  items-center flex  flex-row  md:gap-x-1">
                <h1 className="md:hidden text-gray-700/70"> Action</h1>
                <User
                  className="cursor-pointer"
                  onClick={() => handleOneuser(user)}
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
                ></Trash>
              </div>
              <div className=" w-full  md:w-2/12 text-left min-h-12 md:block flex gap-x-3 items-center  md:place-content-center">
                <h1 className="md:hidden">status</h1>
                <button className="px-3 py-1 rounded-2xl bg-[#CEEDD2] text-center text-green-500 flex  flex-row md:block md:gap-x-1">
                  {" "}
                  unblocked
                </button>
              </div>
            </div>
          ))}
        </div> */}
      {/* </div> */}
      
  {users.length==0 ?(<h2>there are no users</h2>):( 
    <TablePagination
  columns={columns}
  data={users}
  page={page}
  totalPages ={totalPages}
  total={users.length}
onPageChange={ setPage}
renderActions={(user) => (
  <div className="flex gap-2 text-center items-center place-content-center text-[#705CC7]  " >
    <EllipsisVertical
      className="cursor-pointer"

  onClick={(e) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setMenu(user._id);
    setMenuPos({
      x: rect.right,
      y: rect.bottom,
    });
  }}
    />

   
  </div>
)}

  
  renderExtra={(user) => (

    user.active=='block' && (
    <div className="flex place-content-center items-center">
      <button
        onClick={() => handleunblockUser(user)}
        className="bg-green-200 px-2 place-content-center text-center   py-1 rounded-lg hover:bg-green-300"
      >
        unblock user
  
      </button>
      </div>
    )
  )}
/> 
       )}



      {isEditOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsEditOpen(false)}
          />
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            <h2 className="text-xl font-bold mb-4">add the user </h2>

            <label className="flex flex-col w-full  " htmlFor="userName">
              <h1>Username</h1>
              <input
                placeholder="write the UserName"
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
                placeholder="write the email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              />
              <label className="flex flex-col w-full  " htmlFor="phoneNumber">
                <h1>phoneNumber</h1>
                <input
                  placeholder="phonenumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handlechange}
                  className="border p-2 w-full mb-4"
                />
              </label>
            </label>
            <label className="flex flex-col w-full" htmlFor="accountType">
              <h1>accountType</h1>
              <select
                placeholder="u  accountType"
                type="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handlechange}
                className="border p-2 w-full mb-4 "
              >
                <option value="teamMember">TeamMember</option>
                <option value="admin">admin</option>
                <option value="projectManager">ProjectManager</option>
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
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={onHandleAdd}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                add the user
              </button>
            </div>
          </div>
        </>
      )}
      {oneUser && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOneUser(false)}
          />

          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
            <div className="flex w-full place-content-center  items-center">
              <h1 className="text-center text-2xl capitalize text-gray-900 font-semibold">
                user Data
              </h1>
            </div>
            <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
              <h1>name</h1>
              <h1>{user1.userName}</h1>
            </div>
            <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
              <h1>email</h1>
              <h1>{user1.email}</h1>
            </div>
            <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-2 ">
              <h1>accountType</h1>
              <h1>{user1.accountType}</h1>
            </div>
          </div>
        </>
      )}
      <UserMenu
      menuList={{edit:'Edit',view:'User Details',delete:'Remove'}}
        menu={menu}
        setMenu={setMenu}
        menuPos={menuPos}
        users={users}
        handleModifyButton={handleModifyButton}
        handleOneuser={handleOneuser}
        handleDelete={handleDelete}
      />

      {modify && (
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
                placeholder="update the email"
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
                  <option value="teamMember">TeamMember</option>
                  <option value="admin">admin</option>
                  <option value="projectManager">ProjectManager</option>
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
      {conformation && (
      <ConformationBox
        onClose={() => setConformation(false)}
        onConfirm={async () => {
          const res = await deleteUser(userId);
          if (res) {
            fetchUsers();
            toast.success("User deleted successfully!");
          }
        }}
        message="Are you sure you want to delete this user?"
      />
      )
      }
    </div>
  );
}

export default Users;
