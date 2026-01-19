import React, { useEffect, useState } from "react";
import {blockUsers,  getBlockUser, getUserById, getUserDataAPI,  handleunblockUserAPI, } from "../../services/user.service";
import TablePagination from "../../components/ui/TablePagination";
import  { Eye, EyeOff } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
function Ipaddress() {
  const [users, setUsers] = useState([]);
 const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [blockUser, setBlockUser] = useState([]);
const [blockUserB, setBlockUserB] = useState(false);
  const [userId, setUserId] = useState("");
  const [buttonClick, setButtonClick] = useState(false);
  const [userData,setUserData]=useState(false);
  const [member,setmember] =useState({
    userName :'',
    email:'',
    accountType :'',
    active :''
  })
  const fetchuser = async () => {
    try {
      const res = await getUserDataAPI();
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users!");
    }
  };

  

  const handleSubmit = async(e)=>{

try {
     
      setUserId(e.target.value);
       const _id = e.target.value ;
      console.log(_id);
      const res = await getUserById(_id);
      console.log(res.data.user);
      setmember(res.data.user);
      setBlockUserB(true)
      setUserData(true)
      toast.success('get the user ip  successfully')
} catch (error) {
  console.log(error)
  toast.error('error accured', error.message)
  
}
  }
  const submitHandler = async () => {
    if (!userId) {
      toast.error("Please select a user!");
      return;
    }

    try {
      console.log(userId);

      const res = await blockUsers(userId);
      console.log(res);
      toast.success("User blocked successfully!");
      setButtonClick(false);
      fetchBlockUser();
      setBlockUserB(false);
      setUserData(false);
      fetchuser();
    } catch (error) {
      console.log(error);
      toast.error("Failed to block user!");
    }
  };

  useEffect (() => {
    fetchuser();

  },[])
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

  const fetchBlockUser = async () => {
    try {
      const data = await getBlockUser(page, 5);
      setBlockUser(data.users || []);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to fetch blockuser!");
    }
  };
 useEffect(() => {
    fetchBlockUser();
  
  }, [page]); 
    const handleunblockUser = async (user) => {
      try {
        console.log(user._id);
        const userId = user._id;
        const res = await handleunblockUserAPI(userId);
        console.log(res)
        fetchBlockUser();
        console.log(res);
        toast.success("User unblocked successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to unblock user!");
      }
    };

  return (
    <div className="min-h-screen px-5  bg-[#F7F7F7]  flex flex-col items-center gap-3">

   <div className="w-full h-20  justify-between flex flex-row  items-center   ">
        <h1 className="text-2xl font-bold capitalize text-gray-800">
          block users
        </h1>
        <button
          className="px-6 py-2 hover:scale-101 hover:text-white rounded-lg text-gray-800 font-semibold text-center bg-[#7143f047] transition-all cursor-pointer capitalize"
       onClick={()=>setBlockUserB(true)}
        >
          block user 
        </button>
      </div>
   {
    blockUser.length === 0 ? (
      <>
      <div className="bg-white   flex flex-col w-full  rounded-2xl gap-y-4 py-1 items-center ">
             <TablePagination 
      columns={columns}
      data={blockUser}
   renderExtra={(user) => (
    user.active=='block' && (

      <div className="flex place-content-center items-center">
      <button
        onClick={() => handleunblockUser(user)}
        className="bg-green-200 px-2 py-1 text-center  place-content-center rounded-lg hover:bg-green-300"
      >
        unblock user
      </button>
      </div>
    )
  )}
      />
      <h1 className="text-2xl capitalize   text-gray-700  font-semibold">there is not any blocked user</h1>
      </div>
 
      </>
    ) : (<>
     <TablePagination
      columns={columns}
      data={blockUser}
      page={page}
      totalPages ={totalPages}
      total={blockUser.length}
      onPageChange={setPage}
        renderExtra={(user) => (
    user.active=='block' && (

      <div className="flex place-content-center items-center">
      <button
        onClick={() => handleunblockUser(user)}
        className="bg-green-200 px-2 py-1 text-center  place-content-center rounded-lg hover:bg-green-300"
      >
        unblock user
      </button>
      </div>
    )
  )}
    // renderActions={(user) => (
    //  <div className="flex gap-2 place-content-center text-left text-[#705CC7] relative">
    //    {/* <EllipsisVertical
    //      className="cursor-pointer"
    //      onClick={() =>
    //        setMenu(menu === user._id ? null : user._id)
    //      }
    //    /> */}
    
    //    {/* {menu === user._id && (
    //      <div className="absolute right-12  top-10 bg-white shadow-md rounded w-36 z-50">
    //        <div
    //          className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
    //          onClick={() => {
    //            handleModifyButton(user);
    //            setMenu(null);
    //          }}
    //        >
    //          Edit
    //        </div>
    
    //        <div
    //          className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
    //          onClick={() => {
    //            handleDelete(user);
    //            setMenu(null);
    //          }}
    //        >
    //          Delete
    //        </div>
    
    //        <div
    //          className="text-black px-4 py-2 hover:bg-gray-100 cursor-pointer"
    //          onClick={() => {
    //            handleAssignButton(user);
    //            setMenu(null);
    //          }}
    //        >
    //          Assign Project
    //        </div>
    //      </div>
    //    )} */}
    //  </div>
    // )}
     />

    </>)
   }
{/* 
{
  blockUserB && (
    <> <div className=" fixed inset-0  z-40"
            onClick={() => setBlockUserB(false)}></div>
<div className="absolute right-0 top-10  bg-white shadow-md rounded w-36 z-50">



    
        <select
          className={`${
            buttonClick ? "bg-gray-50" : "bg-blend-saturation"
          } cursor-pointer p-2 bg-white rounded-sm `} value={userId} onChange={(e) => setUserId(e.target.value)}
             
        >
          <option value="" disabled>
            Select IP Address
          </option>

          {users.map((user) => (
            <>
              {" "}
              <option 
                key={user._id}
                className="w-full bg-white  cursor-pointer"
                value={user._id}
              >
                {user.ipAddress}
              </option>
              
            </> 
          ))}
        </select>
        <button className="flex py-2 px-4 rounded-2xl  capitalize cursor-pointer font-semibold  bg-green-300 justify-items-start hover:bg-green-500 " onClick={handleSubmit}>enter to get user details</button>

      
      { userData && (
         <div className="flex flex-col justify-between bg-white shadow-lg p-3.5 gap-7 w-full rounded-2xl">
    <div className="flex flex-row gap-1  capitalize">
      <h1>Name:</h1>
       <h1 className="text-gray-700 font-semibold">{member.userName}</h1>
    </div>
     <div className="flex flex-row gap-1 capitalize ">
      <h1>email:</h1>
       <h1 className="text-gray-700 font-semibold">{member.email}</h1>
    </div>
      <div className="flex flex-row gap-1 capitalize ">
      <h1>accoutType:</h1>
       <h1 className="text-gray-700 font-semibold">{member.accountType}</h1>
    </div>
     <div className="flex flex-row gap-1 capitalize ">
      <h1>active:</h1>
       <h1 className="text-gray-700 font-semibold">{member.active}</h1>
    </div>

  </div>
      )}
</div>
 <div className="flex justify-end gap-2">
              <button
                onClick={() => setBlockUserB(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              
                  <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={submitHandler}>block the user </button>
              
                
              
                
            
            </div>


            </>
  )
} */}
   {blockUserB && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setBlockUserB(false)}
          />
          <div
            className="fixed z-50 top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        bg-white p-6 rounded shadow w-96"
          >
        
         
         <h2 className="text-xl font-bold mb-4">select  the user </h2>

            <label className="flex flex-col w-full  " htmlFor="userName">
              <h1></h1>
              <select

          className={`${
            buttonClick ? "bg-gray-50" : "bg-blend-saturation"
          } cursor-pointer p-2 bg-white rounded-sm `} value={userId} onChange={(e) => { handleSubmit(e);  }}
             
        >
          <option value="" disabled>
            Select  user
          </option>

          {users.map((user) => (
            <>
              {" "}
              <option 
                key={user._id}
              
                className="w-full bg-white  cursor-pointer"
                value={user._id}
              >
                {user.userName}
              </option>
              {

              }
              
            </> 
          ))}
        </select>
        

        
              
            </label>
          
             { userData && (
         <div className="flex flex-col justify-between bg-white shadow-lg p-3.5 gap-7 w-full rounded-2xl">
    <div className="flex flex-row gap-1  capitalize">
      <h1>Name:</h1>
       <h1 className="text-gray-700 font-semibold">{member.userName}</h1>
    </div>
     <div className="flex flex-row gap-1 capitalize ">
      <h1>email:</h1>
       <h1 className="text-gray-700 font-semibold">{member.email}</h1>
    </div>
      <div className="flex flex-row gap-1 capitalize ">
      <h1>ipaddress:</h1>
       <h1 className="text-gray-700 font-semibold">{member.ipAddress}</h1>
    </div>
     <div className="flex flex-row gap-1 capitalize ">
      <h1>active:</h1>
       <h1 className="text-gray-700 font-semibold">{member.active}</h1>
    </div>

  </div>
      )}
       
    {
      userData && (<>
       <div className="flex justify-end mt-3 gap-5">
              <button
                onClick={() => setBlockUserB(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={submitHandler}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                 block the user 
              </button>
            </div>
      </>)  }        

           
          </div>
        </>
      )}
    
    </div>
  );
}

export default Ipaddress;
