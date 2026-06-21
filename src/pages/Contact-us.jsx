import React from "react";
import Navbar from "../components/Navbar";
import { ArrowRight, Mail, Phone, MessageSquare, Globe } from "lucide-react";

function Contactus() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Column - Contact Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-between text-left gap-8">
            <div className="flex flex-col gap-4">
              <span className="bg-primary/10 text-primary dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit">
                ✉️ Support Center
              </span>
              <h2 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent leading-tight mt-2">
                Connect with the Arena Support.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2 max-w-sm">
                Need help with coin verification, reward store vouchers, or multiplayer matchmaking? Reach out to our assistance team.
              </p>
            </div>

            <div className="flex flex-col gap-5 border-t border-slate-100 dark:border-slate-800/60 pt-6">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mt-0.5">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Email Address</h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">sandipbisen1799@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mt-0.5">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Phone Support</h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">+91 9755149009</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-805/50 rounded-2xl shadow-xs">
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Message submitted successfully!"); }} className="flex flex-col gap-4">
              
              {/* Name */}
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="name" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                  Your Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  placeholder="e.g. John Smith" 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/10 transition-all text-xs"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="email" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  placeholder="name@domain.com" 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/10 transition-all text-xs"
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="category" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                  Support Category
                </label>
                <select 
                  name="category" 
                  id="category" 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/10 transition-all text-xs"
                >
                  <option value="wallet">Coin Balance & Cashouts</option>
                  <option value="multiplayer">Multiplayer Matchmaking</option>
                  <option value="store">Store Redemption Queries</option>
                  <option value="account">Account Access & Errors</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="message" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                  Describe Request
                </label>
                <textarea 
                  name="message" 
                  id="message"
                  placeholder="Tell us how we can help you..." 
                  className="w-full min-h-[100px] px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary dark:focus:border-indigo-500 focus:ring-2 focus:ring-primary/10 transition-all text-xs"
                  required
                />
              </div>

              <button 
                type="submit"
                className="btn-premium w-full text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs"
              > 
                Submit Request <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contactus;
