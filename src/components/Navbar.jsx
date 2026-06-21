import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApi } from "../context/contextApi.jsx";
import { logoutAPI } from "../services/user.service";
import { toast } from "react-toastify";
import { Sun, Moon, Menu, X } from "lucide-react";
import profileimage from "../assets/profileimg.png";

function Navbar() {
  const { islogin, setUser, user, setIsLogin, theme, toggleTheme } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await logoutAPI();
      if (res?.data?.success || res?.success) {
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
    `px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
      location.pathname === path
        ? "bg-primary text-white shadow-md shadow-primary/25"
        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
    }`;

  const goProfile = () => {
    if (user?.accountType) {
      navigate(`/${user.accountType}/profile`);
    }
    setMenuOpen(false);
  };

  const handleManagement = () => {
    if (!islogin || !user?.accountType) return navigate("/login");

    const routes = {
      admin: "/admin",
      projectManager: "/projectManager",
      teamMember: "/teamMember",
      user: "/user/lobby",
    };

    const targetRoute = routes[user.accountType] || "/user/lobby";
    navigate(targetRoute);
    setMenuOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-center relative z-50 py-3">
      {/* Decorative Blur Background behind the Nav */}
      <div className="absolute top-0 w-full h-[150px] bg-gradient-to-b from-primary/5 to-transparent blur-xl pointer-events-none -z-10" />

      <div className="w-[92%] max-w-7xl px-6 py-3.5 flex justify-between items-center rounded-2xl border border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xs transition-colors duration-300">
        {/* Logo */}
        <div 
          onClick={() => navigate("/")}
          className="font-black text-2xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent cursor-pointer flex items-center gap-1.5"
        >
          Winden
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-slate-655 dark:text-slate-300 text-sm font-semibold">
          <Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
          <button onClick={handleManagement} className="hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
            Play Console
          </button>
          <button onClick={() => navigate("/contact-us")} className="hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
            Contact Us
          </button>
        </div>

        {/* Desktop Auth and Settings */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          {islogin ? (
            <div className="flex items-center gap-3">
              <img
                src={user?.imageUrl || profileimage}
                alt="profile"
                onClick={goProfile}
                className="w-8 h-8 rounded-full border border-slate-250 dark:border-slate-700 cursor-pointer object-cover shadow-xs"
              />
              <button className={itemClass(`/${user?.accountType || 'user'}/profile`)} onClick={goProfile}>
                Profile
              </button>
              <button 
                className="px-4 py-2 text-sm font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl transition-all cursor-pointer" 
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className={itemClass("/login")} onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu & Theme Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-xl transition-all mr-1"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <button
            className="p-2 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="fixed z-50 right-4 top-18 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl w-60 p-4 lg:hidden flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-2.5">
                <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Home
                </Link>
                <button onClick={handleManagement} className="text-left px-4 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                  Play Console
                </button>
                <button onClick={() => { navigate("/contact-us"); setMenuOpen(false); }} className="text-left px-4 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                  Contact Us
                </button>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

              {islogin ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user?.imageUrl || profileimage}
                      alt="profile"
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                    />
                    <div className="text-left">
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{user?.userName || "Player"}</p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-450 line-clamp-1">{user?.email}</p>
                    </div>
                  </div>
                  <button className={itemClass(`/${user?.accountType || 'user'}/profile`)} onClick={goProfile}>
                    Profile
                  </button>
                  <button 
                    className="w-full px-4 py-2.5 text-center text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl transition-all cursor-pointer" 
                    onClick={() => { logoutHandler(); setMenuOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button className={itemClass("/login")} onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                    Login
                  </button>
                  <button className="w-full px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer" onClick={() => { navigate("/signup"); setMenuOpen(false); }}>
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
