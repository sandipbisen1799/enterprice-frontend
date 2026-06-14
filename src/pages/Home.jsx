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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 -z-10">
          <div
            className="w-full h-full bg-linear-to-br
                from-blue-900/40 via-purple-900/20 to-slate-900
                blur-3xl scale-110"
          ></div>
        </div>

        <div
          className="relative max-w-6xl w-full
            backdrop-blur-sm
              p-8 md:p-16 flex flex-col md:flex-row items-center"
        >
          <div className="w-full md:w-1/2 h-full overflow-hidden flex justify-center">
            <img src={laptop} alt="Laptop illustration" className="max-h-[300px] object-contain md:max-h-full" />
          </div>
          <div className="w-full md:w-1/2 h-full text-white">
            <h1 className="mt-4 md:mt-12 text-blue-400 capitalize text-sm font-bold tracking-wider">
              WELCOMING HAND CRICKET arena
            </h1>

            <h1 className="text-3xl md:text-5xl font-black mt-2 leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Play, Win and Earn Rewards.
            </h1>
            <p className="mt-6 text-slate-400 max-w-xl text-lg">
              Challenge bots or players in real-time, watched sponsored ads to accumulate gaming coins, and redeem them directly for premium vouchers, gift cards, and more!
            </p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => navigate("/login")} className="px-8 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105">
                Play Now
              </button>
              <button onClick={() => navigate("/signup")} className="px-8 py-3.5 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-bold rounded-full transition-all">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
