import React, { useEffect, useRef, useState } from "react";
import profileimage from "../assets/profileimg.png";
import { useApi } from "../context/contextApi";
import {
  changePasswordAPI,
  reverifyuserAPI,
  uploadImageAPI,
  verifyuserAPI,
  updateProfileAPI,
} from "../services/user.service";
import { toast } from "react-toastify";
import { Camera, Eye, EyeOff, User, Mail, Shield, Phone, Lock, Edit3 } from "lucide-react";

function Profile() {
  const { user, checkAuth, theme } = useApi();

  /* ---------------- STATE ---------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [otpInput, setOtpInput] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: user?.userName || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [modifyPassword, setModifyPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const [password, setPassword] = useState({
    priviouspassword: "",
    password: "",
    retypePassword: "",
  });

  const inputsRef = useRef([]);

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    setProfileData({
      userName: user?.userName || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setImageUrl(user?.imageUrl || "");
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

  const handleEnterKey = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      userName: user?.userName || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  /* ---------------- PASSWORD ---------------- */
  const handleChangePassword = () => {
    setModifyPassword(true);
  };

  const submitPassword = async () => {
    if (password.password !== password.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.password === password.priviouspassword) {
      toast.error("New password and previous password cannot be the same");
      return;
    }
    try {
      const formData = { priviouspassword: password.priviouspassword, password: password.password };
      await changePasswordAPI(formData);
      toast.success("Password changed successfully");
      setPassword({ priviouspassword: "", password: "", retypePassword: "" });
      setModifyPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  };

  /* ---------------- OTP ---------------- */
  const handleVerifyRequest = async () => {
    try {
      await reverifyuserAPI({ email: user?.email });
      setOtpInput(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyUser = async () => {
    try {
      await verifyuserAPI({ email: user?.email, otp });
      toast.success("Account verified successfully!");
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
      toast.success("Image uploaded successfully");
      setSelectedFile(null);
      checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-xs">
        
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 text-center md:text-left flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> My Profile
        </h1>

        {/* Profile Avatar / Photo Container */}
        <div className="flex flex-col items-center gap-5 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 relative group shadow-sm bg-slate-50 dark:bg-slate-950">
            <img
              src={imageUrl || profileimage}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
            {isEditing && (
              <label className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Camera className="w-6 h-6" />
              </label>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing && selectedFile && (
              <button
                onClick={submitImage}
                className="bg-emerald-555 hover:bg-emerald-600 text-slate-900 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer text-xs"
              >
                Save New Photo
              </button>
            )}
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-2 rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancelEdit} className="border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Form Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Username */}
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-805 rounded-xl p-4 flex items-center gap-3">
            <User className="w-4.5 h-4.5 text-slate-405" />
            <div className="flex-1">
              <label htmlFor="userName" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Username</label>
              <input
                type="text"
                name="userName"
                id="userName"
                ref={(el) => (inputsRef.current[0] = el)}
                onKeyDown={(e) => handleEnterKey(e, 0)}
                value={profileData.userName}
                readOnly={!isEditing}
                onChange={handleChange}
                className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                placeholder="Username"
              />
            </div>
          </div>

          {/* Email */}
          <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <Mail className="w-4.5 h-4.5 text-slate-450 dark:text-slate-550" />
            <div className="flex-1">
              <label htmlFor="email" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-550 tracking-wider">Email Address</label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                readOnly
                className="bg-transparent text-sm font-semibold text-slate-500 dark:text-slate-500 w-full mt-0.5 outline-none"
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-4.5 h-4.5 text-slate-450 dark:text-slate-550" />
            <div className="flex-1">
              <label htmlFor="accountType" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-550 tracking-wider">Account Role</label>
              <input
                type="text"
                id="accountType"
                value={user?.accountType || ""}
                readOnly
                className="bg-transparent text-sm font-semibold text-slate-500 dark:text-slate-500 w-full mt-0.5 outline-none capitalize"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-805 rounded-xl p-4 flex items-center gap-3">
            <Phone className="w-4.5 h-4.5 text-slate-405" />
            <div className="flex-1">
              <label htmlFor="phoneNumber" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                ref={(el) => (inputsRef.current[1] = el)}
                onKeyDown={(e) => handleEnterKey(e, 1)}
                value={profileData.phoneNumber}
                readOnly={!isEditing}
                onChange={handleChange}
                className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                placeholder="Not Provided"
              />
            </div>
          </div>
        </div>

        {/* Verification Alert / Flow */}
        {!user?.isVerified && !otpInput && (
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400">Account Unverified</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Verify your email to enable match reward cashouts.</p>
            </div>
            <button onClick={handleVerifyRequest} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs">
              Verify Now
            </button>
          </div>
        )}

        {otpInput && (
          <div className="mt-8 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-805 p-6 rounded-2xl flex flex-col gap-4 text-left">
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Enter Verification Code</h4>
              <p className="text-xs text-slate-400 mt-0.5">Please check your inbox for the OTP.</p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="w-full max-w-[200px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-center tracking-widest font-black focus:outline-none focus:border-primary text-base"
              />
              <button onClick={handleVerifyUser} className="bg-emerald-555 hover:bg-emerald-600 text-slate-900 font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                Confirm Code
              </button>
            </div>
          </div>
        )}

        {/* Change Password Trigger */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 text-left">
          <button onClick={handleChangePassword} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-255 border border-slate-200/50 dark:border-slate-700/50 font-bold px-5 py-2.5 rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Change Password
          </button>
        </div>
      
      </div>

      {/* Change Password Dialog Modal */}
      {modifyPassword && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 flex items-center justify-center p-4"
            onClick={() => setModifyPassword(false)}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-left flex flex-col gap-6"
            >
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> Change Password
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Update your credentials to secure your console account.</p>
              </div>

              <div className="flex flex-col gap-4">
                
                {/* Previous Password */}
                <div className="relative">
                  <input
                    type={showPrevious ? "text" : "password"}
                    name="priviouspassword"
                    value={password.priviouspassword}
                    onChange={handlePasswordChange}
                    placeholder="Previous password"
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl focus:outline-none focus:border-primary text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrevious(!showPrevious)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-655"
                  >
                    {showPrevious ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    name="password"
                    value={password.password}
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl focus:outline-none focus:border-primary text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-655"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Retype Password */}
                <div className="relative">
                  <input
                    type={showRetype ? "text" : "password"}
                    name="retypePassword"
                    value={password.retypePassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl focus:outline-none focus:border-primary text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRetype(!showRetype)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-655"
                  >
                    {showRetype ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setModifyPassword(false)}
                  className="bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
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
