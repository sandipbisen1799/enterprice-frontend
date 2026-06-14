import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useApi } from "../context/contextApi.jsx";
import { logoutAPI } from "../services/user.service";
import { getWalletBalanceAPI } from "../services/wallet.service";
import { toast } from "react-toastify";
import { 
  Trophy, 
  Award, 
  Wallet, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X,
  Coins,
  Sparkles
} from "lucide-react";
import profileimage from "../assets/profileimg.png";

function UserLayout() {
  const { user, setUser, setIsLogin, checkAuth } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState({ adCoins: 0, rewardCoins: 0 });

  const fetchBalances = async () => {
    try {
      const balance = await getWalletBalanceAPI();
      setWalletBalance(balance);
    } catch (err) {
      console.error("Failed to load balances:", err);
    }
  };

  useEffect(() => {
    fetchBalances();
    // Poll balances every 8 seconds for real-time visual credit updates
    const interval = setInterval(fetchBalances, 8000);
    return () => clearInterval(interval);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutAPI();
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
    } catch {
      toast.error("Logout failed!");
    }
  };

  const navItems = [
    { name: "Lobby", path: "/user/lobby", icon: Trophy },
    { name: "Tournaments", path: "/user/tournaments", icon: Award },
    { name: "Wallet & Cashout", path: "/user/wallet", icon: Wallet },
    { name: "Reward Store", path: "/user/store", icon: ShoppingBag },
    { name: "Friends & Chat", path: "/user/social", icon: MessageSquare },
    { name: "Leaderboard", path: "/user/leaderboard", icon: TrendingUp },
    { name: "My Profile", path: "/user/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Mobile Header Bar */}
      <header className="md:hidden w-full bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-4 py-3 flex justify-between items-center z-30">
        <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-slate-700 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          MASTERMIND
        </span>
        <img 
          src={user?.imageUrl || profileimage} 
          alt="avatar" 
          className="w-8 h-8 rounded-full border border-slate-600 object-cover" 
        />
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-850 border-r border-slate-800 flex flex-col justify-between py-6 px-4 z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center px-2">
            <span className="font-black text-2xl tracking-wider bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              PLAY CONSOLE
            </span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Bio Card */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center gap-2">
            <div className="relative">
              <img 
                src={user?.imageUrl || profileimage} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover shadow-lg shadow-indigo-500/20" 
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-850 rounded-full" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-100 line-clamp-1">{user?.userName || "Player"}</h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-indigo-650 text-white shadow-md shadow-indigo-650/30" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions / Logout */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={logoutHandler}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Top Header Row for Desktop with Real-time Balances */}
        <header className="hidden md:flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-slate-850/40 backdrop-blur-md sticky top-0 z-20">
          <h1 className="font-bold text-xl text-slate-200">
            Welcome back, <span className="text-indigo-400">{user?.userName || "Player"}</span>
          </h1>

          {/* Coin Wallets Displays */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full" title="Ad Coins (Earned from Watching Ads)">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">{walletBalance.adCoins}</span>
              <span className="text-[10px] uppercase font-semibold text-amber-500">AD</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full" title="Reward Coins (Redeemable for Real Rewards)">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-300">{walletBalance.rewardCoins}</span>
              <span className="text-[10px] uppercase font-semibold text-emerald-500">REWARD</span>
            </div>
          </div>
        </header>

        {/* Dynamic balances row for mobile */}
        <div className="md:hidden flex justify-around items-center px-4 py-2 border-b border-slate-800 bg-slate-850/80">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">{walletBalance.adCoins} <span className="text-[9px] text-amber-500">AD</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">{walletBalance.rewardCoins} <span className="text-[9px] text-emerald-500">REWARD</span></span>
          </div>
        </div>

        {/* Content Router Outlet */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserLayout;
