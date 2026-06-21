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
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import profileimage from "../assets/profileimg.png";

function UserLayout() {
  const { user, setUser, setIsLogin, checkAuth, theme, toggleTheme } = useApi();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row relative transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/8 dark:bg-primary/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/8 dark:bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

      {/* Mobile Header Bar */}
      <header className="md:hidden w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex justify-between items-center z-30 shadow-xs">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          MASTERMIND
        </span>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className="p-2 text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all mr-1">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <img 
            src={user?.imageUrl || profileimage} 
            alt="avatar" 
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover" 
          />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between py-6 px-4 z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} shadow-xl md:shadow-none`}>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center px-2">
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              PLAY CONSOLE
            </span>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-850 dark:hover:text-slate-200 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Bio Card */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-xs">
            <div className="relative">
              <img 
                src={user?.imageUrl || profileimage} 
                alt="Profile" 
                className="w-14 h-14 rounded-full border-2 border-primary object-cover shadow-md shadow-primary/10" 
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="text-center w-full">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{user?.userName || "Player"}</h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5 line-clamp-1">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
                >
                  <Icon className="w-4.5 h-4.5" />
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
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 transition-all cursor-pointer w-full text-left"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Top Header Row for Desktop with Real-time Balances */}
        <header className="hidden md:flex justify-between items-center px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/20 backdrop-blur-md sticky top-0 z-20">
          <h1 className="font-bold text-lg text-slate-800 dark:text-slate-200">
            Welcome back, <span className="text-primary dark:text-indigo-400 font-extrabold">{user?.userName || "Player"}</span>
          </h1>

          {/* Coin Wallets Displays */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full" title="Ad Coins (Earned from Watching Ads)">
              <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-300">{walletBalance.adCoins}</span>
              <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500">AD</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full" title="Reward Coins (Redeemable for Real Rewards)">
              <Coins className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">{walletBalance.rewardCoins}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500">REWARD</span>
            </div>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Dynamic balances row for mobile */}
        <div className="md:hidden flex justify-around items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-300">{walletBalance.adCoins} <span className="text-[9px] text-amber-500">AD</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">{walletBalance.rewardCoins} <span className="text-[9px] text-emerald-500">REWARD</span></span>
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
