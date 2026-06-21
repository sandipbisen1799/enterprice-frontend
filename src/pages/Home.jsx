import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/contextApi";
import laptop from "../assets/images/laptop.png";
import Navbar from "../components/Navbar";

function Home() {
  const { islogin, user } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (islogin && user) {
      if (user.accountType === "admin") {
        navigate("/admin");
      } else {
        navigate("/user/lobby");
      }
    }
  }, [islogin, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-8 md:py-16">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full bg-linear-to-br from-primary/15 via-secondary/10 to-transparent blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[30%] h-[30%] rounded-full bg-accent/10 blur-3xl -z-10 pointer-events-none" />

        <div className="relative max-w-6xl w-full glass-panel rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-6 shadow-xl">
          {/* Illustration Pane */}
          <div className="w-full md:w-1/2 flex justify-center animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="relative">
              {/* Glow Behind the Image */}
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 blur-2xl rounded-full scale-90" />
              <img 
                src={laptop} 
                alt="Laptop illustration" 
                className="max-h-[250px] md:max-h-[400px] object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Hero Content Pane */}
          <div className="w-full md:w-1/2 text-left flex flex-col items-start animate-in fade-in slide-in-from-right-6 duration-700">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary dark:bg-indigo-500/10 dark:text-indigo-400">
              ⚡ Welcoming Hand Cricket Arena
            </span>

            <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
              Play, Win and Earn Rewards.
            </h1>
            
            <p className="mt-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              Challenge bots or players in real-time. Watch sponsored ads to accumulate gaming coins, and redeem them directly for premium vouchers, gift cards, and more!
            </p>

            <div className="flex flex-wrap gap-4 mt-8 w-full sm:w-auto">
              <button 
                onClick={() => navigate("/login")} 
                className="btn-premium px-8 py-3.5 text-white font-bold rounded-xl transition-all cursor-pointer text-sm w-full sm:w-auto text-center"
              >
                Play Now
              </button>
              <button 
                onClick={() => navigate("/signup")} 
                className="px-8 py-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-sm w-full sm:w-auto text-center"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
