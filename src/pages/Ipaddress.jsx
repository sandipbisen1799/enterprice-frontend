import React, { useEffect, useState } from "react";
import { blockUser, getUserDataAPI } from "../services/user.service";

function Ipaddress() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const fetchuser = async () => {
    try {
      const res = await getUserDataAPI();
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  const submitHandler = async () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    try {
      const res = await blockUser(userId);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full mt-20">
      <h1>Block user using IP address</h1>

      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="" disabled>
          Select IP Address
        </option>

        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.ipAddress}
          </option>
        ))}
      </select>

      <button
        className="bg-green-300 px-4 py-1 mt-4"
        onClick={submitHandler}
      >
        Submit
      </button>
    </div>
  );
}

export default Ipaddress;
