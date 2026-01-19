import React, { useContext, useState,useEffect } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Api } from "../context/contextApi.jsx";
import { logoutAPI } from "../services/user.service";
import { useLocation } from "react-router";
import { toast } from 'react-toastify';

function Navbar() {
  const { islogin, setUser, user,setIsLogin  } = useContext(Api);

  const navigate = useNavigate();
  const location = useLocation();


  const [menuOpen, setMenuOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const res = await logoutAPI();

      if (res?.data?.success) {
        localStorage.removeItem("token");
        setUser({
          userName : '',
          isVerified : false,
          email: '',
          accountType :''
        });
        navigate("/login");
        setIsLogin(false)
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed!");
    }
  };
  const itemClass = (
    path
  ) => `px-8 py-2 hover:scale-105 hover:text-white rounded-lg text-center bg-[#7143f047] transition-all cursor-pointer 
${
  location.pathname === path
    ? " text-white font-semibold bg-blue-400"
    : "font-normal bg-[#7143f047]"
}

`;

  const handleManagement = async () => {
     if (!islogin) {
  
    navigate("/login")
    }
   else  if (user.accountType === "admin") {
      navigate("/admin");
    } else if (user.accountType === "projectManager") {
      navigate("/projectManager");
    } else if (user.accountType === "teamMember") {
      navigate("/teamMember");
    } 
  };

  return (
    <>
      <div className=" w-full h-20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="w-full h-full bg-linear-to-br
                from-blue-200 via-pink-100 to-yellow-100
                blur-3xl scale-110"
          ></div>
        </div>
        <div className="flex flex-row justify-between gap-x-1 w-full h-12 px-4 lg:px-9 items-center relative">
          <div className="font-semibold text-xl lg:text-3xl text-gray-700   ">
            Winden
          </div>
          <div className="hidden lg:flex flex-row gap-x-8 capitalize cursor-pointer text-[#9993D5]  font-medium text--700 text-xl  justify-between  items-center">
            <Link to="/" className=" hover:border-b hover:text-[#8078d7]">
              Home
            </Link>
            <Link
              className=" hover:border-b hover:text-[#8078d7]"
              onClick={handleManagement}
            >
              management
            </Link>
            <Link
              className=" hover:border-b hover:text-[#8078d7]"
              onClick={() => navigate("/contact-us")}
            >
              contact-us
            </Link>
          </div>
          <button
            className="lg:hidden flex flex-col justify-center cursor-pointer items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-800"></span>
          </button>
          {menuOpen && (
            <div className="absolute top-full right-0 rounded-xl w-1/4 bg-white/90 shadow-lg lg:hidden z-10">
              <div className="flex flex-col items-center gap-4 py-4">
                <Link
                  to="/"
                  className="border-b-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link onClick={() => setMenuOpen(false)}>management</Link>
                <Link
                  onClick={() => {
                    setMenuOpen(false);

                    navigate("/contact-us");
                  }}
                >
                  contact-us
                </Link>
                {islogin ? (
                  <>
                    <button
                      className={`${itemClass("/profile")} `}
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                    >
                      profile
                    </button>
                    <button
                      className={`${itemClass("/login")} `}
                      onClick={() => {

                        logoutHandler();
                        setMenuOpen(false);
                      }}
                    >
                      logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${itemClass("/login")} `}
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                    >
                      Log in
                    </button>
                    <button
                      className={`${itemClass("/signup")} `}
                      onClick={() => {
                        navigate("/signup");
                        setMenuOpen(false);
                      }}
                    >
                      sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {islogin ? (
            <div className="hidden lg:flex flex-row gap-1 text-center items-center">
              <button
                className={`${itemClass("/profile")} `}
                onClick={() => {
                  navigate("/profile");
                }}
              >
                profile
              </button>
              <button
                className={`${itemClass("/login")} `}
                onClick={logoutHandler}
              >
                logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex flex-row gap-1 text-center items-center">
              <button
                className={`${itemClass("/login")} `}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </button>
              <button
                className={`${itemClass("/signup")} `}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
