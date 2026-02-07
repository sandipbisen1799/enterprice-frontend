import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Api } from "../context/contextApi.jsx";
import { logoutAPI } from "../services/user.service";
import { toast } from "react-toastify";
import profileimage from "../assets/profileimg.png";

function Navbar() {
  const { islogin, setUser, user, setIsLogin } = useContext(Api);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await logoutAPI();
      if (res?.data?.success) {
        localStorage.removeItem("token");
        setUser({
          userName: "",
          isVerified: false,
          email: "",
          accountType: "",
        });
        setIsLogin(false);
        toast.success("Logged out successfully!");
        navigate("/login");
      }
    } catch {
      toast.error("Logout failed!");
    }
  };

  const itemClass = (path) =>
    `px-4 py-2 rounded-lg transition-all hover:scale-105 cursor-pointer ${
      location.pathname === path
        ? "bg-blue-500 text-white font-semibold"
        : "bg-[#7143f047] text-gray-700"
    }`;

  const goProfile = () => {
    navigate(`/${user.accountType}/profile`);
    setMenuOpen(false);
  };

  const handleManagement = () => {
    if (!islogin) return navigate("/login");

    const routes = {
      admin: "/admin",
      projectManager: "/projectManager",
      teamMember: "/teamMember",
    };

    navigate(routes[user.accountType]);
    setMenuOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-center relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100 blur-3xl" />

      <div className="w-full max-w-7xl px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="font-semibold text-2xl text-gray-700">Winden</div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-8 text-[#9993D5] text-lg font-medium">
          <Link to="/" className="hover:text-[#8078d7]">Home</Link>
          <button onClick={handleManagement} className="hover:text-[#8078d7]">
            Management
          </button>
          <button onClick={() => navigate("/contact-us")} className="hover:text-[#8078d7]">
            Contact Us
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-gray-800" />
          <span className="w-6 h-0.5 bg-gray-800" />
          <span className="w-6 h-0.5 bg-gray-800" />
        </button>

        {/* Desktop Auth */}
        {islogin ? (
          <div className="hidden lg:flex items-center gap-3">
            <img
              src={user.imageUrl || profileimage}
              alt="profile"
              onClick={goProfile}
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
            />
            <button className={itemClass(`/${user.accountType}/profile`)} onClick={goProfile}>
              Profile
            </button>
            <button className={itemClass("/login")} onClick={logoutHandler}>
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2">
            <button className={itemClass("/login")} onClick={() => navigate("/login")}>
              Login
            </button>
            <button className={itemClass("/signup")} onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        )}

        {/* Mobile Dropdown */}
        {menuOpen && (
          <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setMenuOpen(false)}
          />
          <div className="fixed z-50 right-4 top-14 bg-white shadow-lg rounded-xl w-52 lg:hidden ">
            <div className="flex flex-col items-center gap-4 py-4">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <button onClick={handleManagement}>Management</button>
              <button onClick={() => navigate("/contact-us")}>Contact Us</button>

              {islogin ? (
                <>
                  <button className={itemClass(`/${user.accountType}/profile`)} onClick={goProfile}>
                    Profile
                  </button>
                  <button className={itemClass("/login")} onClick={logoutHandler}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className={itemClass("/login")} onClick={() => navigate("/login")}>
                    Login
                  </button>
                  <button className={itemClass("/signup")} onClick={() => navigate("/signup")}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
