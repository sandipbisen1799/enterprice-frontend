import React, { useEffect, useRef, useState } from "react";
import profileimage from "../assets/images/laptop.png";
import { useApi } from "../context/contextApi";
import {
  changePasswordAPI,
  reverifyuserAPI,
  uploadImageAPI,
  verifyuserAPI,
  updateProfileAPI,
} from "../services/user.service";
import { toast } from "react-toastify";
import { Camera, Eye,EyeOff } from "lucide-react";
function Profile() {
  const { user, checkAuth } = useApi();

  /* ---------------- STATE ---------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [otpInput, setOtpInput] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: user.userName || "",
    phoneNumber: user.phoneNumber || "",
  });
  const[modifyPassword,setModifyPassword]=useState(false);

  const [formData] = useState({
    otp: "",

  });
    const [password, setPassword] = useState({
    priviouspassword: "",
    password: "",
    retypePassword: "",
  });

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileData({
      userName: user.userName || "",
      phoneNumber: user.phoneNumber || "",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(user.imageUrl || "");
  }, [user]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileAPI(profileData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };
const inputsRef = useRef([]);

const handleEnterKey = (e, index) => {
  if (e.key === "Enter") {
    e.preventDefault();
    inputsRef.current[index + 1]?.focus();
  }
};


  const handleCancelEdit = () => {
    setProfileData({
      userName: user.userName,
      phoneNumber: user.phoneNumber,
    });
    setIsEditing(false);
  };

  /* ---------------- PASSWORD ---------------- */
  const handleChangePassword = async () => {
    setModifyPassword(true);
    
    }

    // try {
    //   await changePasswordAPI({ password: formData.password });
    //   toast.success("Password changed successfully");
    //   setFormData({ otp: "", password: "", retypePassword: "" });
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Password change failed");
    // }
  

  /* ---------------- OTP ---------------- */
  const handleVerifyRequest = async () => {
    try {
      await reverifyuserAPI({ email: user.email });
      setOtpInput(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };
  const submitPassword=async()=>{
    if (password.password !== password.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }
     if (password.password == password.priviouspassword) {
      toast.error("new password and privios password is not same");
      return;
    }
    try {
      const formData ={ priviouspassword: password.priviouspassword, password: password.password }
      await changePasswordAPI(formData);
      toast.success("Password changed successfully");
      setPassword({ priviouspassword: "", password: "", retypePassword: "" });
      setModifyPassword(false);
    }
      catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  }

  const handleVerifyUser = async () => {
    try {
      await verifyuserAPI({ email: user.email, otp: formData.otp });
      toast.success("Account verified");
      setOtpInput(false);
      checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const submitImage = async () => {
    if (!selectedFile) return;

    const form = new FormData();
    form.append("image", selectedFile);

    try {
      await uploadImageAPI(form);
      toast.success("Image uploaded");
      setSelectedFile(null);
      checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen w-full px-5 py-8 bg-gradient-to-br flex items-center justify-center from-blue-50 to-indigo-100">
      <div className="max-w-4xl   bg-white rounded-lg shadow-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Profile</h1>

        {/* PROFILE IMAGE */}
        <div className="flex  flex-col items-center gap-6 mb-8 ">
          <div className=" w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-200 relative">
              {isEditing && (
              <>
               
              
                  <div className="absolute w-12 h-12 -bottom-1 left-1/2  transform -translate-x-1/2 flex items-end justify-center">
              <label className="cursor-pointer  bg-gray-100    flex flex-col items-top justify-between text-gray-600 px-2 py-2 rounded-full ">
                 <input type="file" className=""  accept="image/*" hidden onChange={handleImageChange} />
                  <Camera    className="inline-block   " />
                 
                </label>
            </div>
                
              </>
            )}
           
          <img
            src={imageUrl || profileimage}
            alt="profile"
            className="w-full h-full rounded-full object-cover  shadow-md"
          />
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <>
               
                {selectedFile && (
                  <button
                    onClick={submitImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save Image
                  </button>
                )}
              </>
            )}
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancelEdit} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              name="userName"
                           ref={(el) => (inputsRef.current[0] = el)}
  onKeyDown={(e) => handleEnterKey(e, 0)}
              value={profileData.userName}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              value={user.email}
              readOnly
              className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <input
              value={user.accountType}
              readOnly
              className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
                         ref={(el) => (inputsRef.current[1] = el)}
  onKeyDown={(e) => handleEnterKey(e, 1)}
              name="phoneNumber"
              value={profileData.phoneNumber}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Phone number"
            />
          </div>
        </div>

        {/* VERIFY */}
        {!user.isVerified && !otpInput && (
          <div className="mb-6">
            <button onClick={handleVerifyRequest} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Verify Account
            </button>
          </div>
        )}

        {otpInput && (
          <div className="flex gap-4 mb-6">
            <input
              name="otp"
              value={formData.otp}
              onChange={handlePasswordChange}
              placeholder="Enter OTP"
              className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleVerifyUser} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
              Verify
            </button>
          </div>
        )}

        {/* PASSWORD */}
        <div className="border-t pt-6">
     
          <button onClick={handleChangePassword} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors">
            Change Password
          </button>
        </div>
      
      </div>
      {modifyPassword && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setModifyPassword(false)}
    />

    {/* Centered Modal */}
    <div className="fixed z-50 flex items-center justify-center">
      <div className="bg-white w-[90vw] max-w-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Change Password
        </h2>

        <div className="space-y-4">
           <div className="relative">
             <input
               ref={(el) => (inputsRef.current[0] = el)}
  onKeyDown={(e) => handleEnterKey(e, 0)}

               type={showPrevious ? "text" : "password"}
               name="priviouspassword"
            
               value={password.priviouspassword}
               onChange={handlePasswordChange}
               placeholder="Previous password"
               className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
             />
             <button
               type="button"
               onClick={() => setShowPrevious(!showPrevious)}
               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
             >
               {showPrevious ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
           </div>
          <div className="relative">
            <input
              ref={(el) => (inputsRef.current[1] = el)}
  onKeyDown={(e) => handleEnterKey(e, 1)}

              type={showNew ? "text" : "password"}
              name="password"
              value={password.password}
              onChange={handlePasswordChange}
              placeholder="New password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showRetype ? "text" : "password"}
              name="retypePassword"
              value={password.retypePassword}
              onChange={handlePasswordChange}
                ref={(el) => (inputsRef.current[2] = el)}
  onKeyDown={(e) => handleEnterKey(e, 2)}

              placeholder="Retype password"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowRetype(!showRetype)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showRetype ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setModifyPassword(false)}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            onClick={submitPassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </>
)}

  

    </div>
  );
}

export default Profile;
