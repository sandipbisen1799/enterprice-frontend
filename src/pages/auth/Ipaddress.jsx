import React, { useEffect, useState } from "react";
import { blockUser, getUserById, getUserDataAPI } from "../../services/user.service";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
function Ipaddress() {
  const [users, setUsers] = useState([]);

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

  

  const handleSubmit = async()=>{

try {
      const _id = userId ;
      console.log(_id);
      const res = await getUserById(_id);
      console.log(res.data.user);
      setmember(res.data.user);
      setUserData(true)
      toast.success('user is fetched successfully')
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
      const res = await blockUser(userId);
      console.log(res);
      toast.success("User blocked successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to block user!");
    }
  };

  useEffect (() => {
    fetchuser();

  },[])

  return (
    <div className="min-h-screen px-5  bg-[#F7F7F7]  flex flex-col items-center gap-3">
      <h1 className="text-2xl  font-semibold text-gray-800/90 capitalize">
        Block user using IP address
      </h1>

      <Button
        variants="success"
        size="sm"
        className="px-4 py-1"
        onClick={() => setButtonClick(true)}
      >
        block the ip
      </Button>
      {buttonClick && (
        <>
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
</>
      )}
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
    <button className="py-2 px-4 rounded-2xl bg-red-400 hover:bg-red-600 cursor-pointer capitalize text-white " onClick={submitHandler}>block the user </button>
  </div>
      )}
 
    </div>
  );
}

export default Ipaddress;
