import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/contextApi";
import { 
  Trophy, 
  Tv, 
  Gift, 
  Gamepad2, 
  Compass, 
  Zap, 
  Sparkles,
  Loader2,
  Calendar,
  Sparkle
} from "lucide-react";
import { toast } from "react-toastify";
import { 
  getAdStatsAPI, 
  getAdConfigAPI, 
  claimFreeCoinsAPI, 
  recordAdImpressionAPI, 
  recordAdCompletionAPI 
} from "../services/ads.service";
import { startFunModeAPI, getMatchmakingStatusAPI, leaveFunModeAPI } from "../services/game.service";

function UserLobby() {
  const navigate = useNavigate();
  const { checkAuth, theme } = useApi();
  const [adStats, setAdStats] = useState({ todayAdsWatched: 0, dailyLimit: 15, remainingAds: 15, totalCoinsEarned: 0 });
  const [adConfig, setAdConfig] = useState({ rewardAmount: 50, dailyLimit: 15 });
  const [loading, setLoading] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);

  // Matchmaking states
  const [inQueue, setInQueue] = useState(false);
  const [queueTime, setQueueTime] = useState(0);

  // Bot Selection Dialog
  const [botModalOpen, setBotModalOpen] = useState(false);
  const [botConfig, setBotConfig] = useState({ difficulty: "medium", personality: "balanced" });

  const loadAdStats = async () => {
    try {
      const stats = await getAdStatsAPI();
      if (stats?.stats) setAdStats(stats.stats);
      const config = await getAdConfigAPI();
      if (config?.config) setAdConfig(config.config);
    } catch (err) {
      console.error("Failed to load ad statistics:", err);
    }
  };

  useEffect(() => {
    loadAdStats();
  }, []);

  // Matchmaking polling timer
  useEffect(() => {
    let interval;
    let timer;
    if (inQueue) {
      timer = setInterval(() => setQueueTime(prev => prev + 1), 1000);
      
      const pollQueue = async () => {
        try {
          const status = await getMatchmakingStatusAPI();
          if (status?.activeMatch) {
            setInQueue(false);
            toast.success("Match Found! Joining game...");
            navigate(`/user/game/${status.activeMatch.gameId}?multiplayer=true`);
          }
        } catch (err) {
          console.error("Matchmaking poll error:", err);
        }
      };

      // Poll every 3 seconds
      interval = setInterval(pollQueue, 3000);
    } else {
      setQueueTime(0);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [inQueue, navigate]);

  const handleClaimFreeCoins = async () => {
    setLoading(true);
    try {
      const res = await claimFreeCoinsAPI();
      if (res?.success) {
        toast.success(`Claimed ${res.coinsEarned} Free Coins successfully!`);
        checkAuth();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "You have already claimed your daily coins!");
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = async () => {
    if (adStats.remainingAds <= 0) {
      toast.warning("Daily ad limit reached! Check back tomorrow.");
      return;
    }

    setWatchingAd(true);
    setAdCountdown(4);

    try {
      const impression = await recordAdImpressionAPI({
        adType: "rewarded",
        adNetwork: "admob",
        adUnitId: "ca-app-pub-3940256099942544/5224354917"
      });

      const impressionId = impression.impressionId || impression.data?.impressionId;

      const countdownInterval = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      await new Promise(resolve => setTimeout(resolve, 4000));

      const res = await recordAdCompletionAPI(impressionId);
      if (res?.success) {
        toast.success(`Ad watched! Earned ${res.coinsEarned || 50} Coins 🪙`);
        loadAdStats();
        checkAuth();
      }
    } catch (err) {
      console.error(err);
      toast.error("Ad playback interrupted!");
    } finally {
      setWatchingAd(false);
      setAdCountdown(0);
    }
  };

  const handleStartPractice = () => {
    navigate("/user/game/practice?gameMode=practice");
  };

  const handleStartBotGame = () => {
    setBotModalOpen(false);
    navigate(`/user/game/vs_bot?gameMode=vs_bot&difficulty=${botConfig.difficulty}&personality=${botConfig.personality}`);
  };

  const handleStartVs100 = () => {
    navigate("/user/game/vs100?gameMode=vs100&entryFee=100");
  };

  const handleToggleQueue = async () => {
    if (inQueue) {
      try {
        await leaveFunModeAPI();
        setInQueue(false);
        toast.info("Left matchmaking queue.");
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await startFunModeAPI({ entryFee: 0 });
        setInQueue(true);
        toast.success("Joined Multiplayer Matchmaking Queue...");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to join queue. Make sure you have sufficient entry coins!");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 md:p-10 shadow-xl shadow-primary/10">
        {/* Background Accents */}
        <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[150%] rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl text-left">
          <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
            🏏 Play & Earn
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white mt-4 leading-tight">
            Strike numbers, score runs, and earn real rewards!
          </h2>
          <p className="text-slate-100 mt-3 text-xs md:text-sm opacity-90 leading-relaxed">
            Pick a game mode below to match against a bot or other active online users in real-time.
          </p>
        </div>
      </div>

      {/* Grid Layout: Play Modes & Earning Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Play Modes Selection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="font-extrabold text-xl tracking-wide flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
            <Gamepad2 className="w-5 h-5 text-primary" />
            Select Game Mode
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Practice Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
              <div className="text-left">
                <div className="w-11 h-11 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mt-4 text-slate-800 dark:text-slate-100">Practice Nets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Learn the timing, controls, and scoring mechanics with zero stakes. Practice makes perfect.
                </p>
              </div>
              <button onClick={handleStartPractice} className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs">
                Enter Nets
              </button>
            </div>

            {/* VS Computer Bot Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
              <div className="text-left">
                <div className="w-11 h-11 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mt-4 text-slate-800 dark:text-slate-100">VS Computer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Challenge our custom Bot AI. Select bot difficulties and personalities to test your limits.
                </p>
              </div>
              <button onClick={() => setBotModalOpen(true)} className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs">
                Choose Config
              </button>
            </div>

            {/* VS 100 Mode Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
              <div className="text-left">
                <div className="w-11 h-11 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base mt-4 text-slate-800 dark:text-slate-100">VS 100 Arena</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Pay 100 Entry Fee to challenge higher level bots. Double stakes, double rewards.
                </p>
              </div>
              <button onClick={handleStartVs100} className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-secondary hover:text-white text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs">
                Join Arena (100 AD)
              </button>
            </div>

            {/* Real-time Multiplayer Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group relative overflow-hidden">
              {inQueue && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 flex flex-col items-center justify-center gap-3.5 z-20 p-5">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Searching for Opponents...</p>
                    <p className="text-[11px] text-slate-400 mt-1">Elapsed time: {queueTime} seconds</p>
                  </div>
                  <button onClick={handleToggleQueue} className="text-xs text-rose-500 hover:text-rose-600 border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/10 px-4 py-2 rounded-full transition-all cursor-pointer font-bold">
                    Cancel Search
                  </button>
                </div>
              )}
              <div className="text-left">
                <div className="w-11 h-11 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Trophy className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="font-bold text-base mt-4 text-slate-800 dark:text-slate-100">Live Multiplayer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Match instantly against other active online users in turn-based Socket.IO gameplay.
                </p>
              </div>
              <button onClick={handleToggleQueue} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs">
                Find Quick Match
              </button>
            </div>
            
          </div>
        </div>

        {/* Earning Center Sidebar */}
        <div className="flex flex-col gap-6">
          <h2 className="font-extrabold text-xl tracking-wide flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
            <Gift className="w-5 h-5 text-emerald-500" />
            Earning Station
          </h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xs">
            
            {/* Daily Attendance Card */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex items-center justify-between gap-4 text-left">
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" /> Daily Check-In
                </h4>
                <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">Claim your daily allowance of free coins.</p>
              </div>
              <button 
                onClick={handleClaimFreeCoins}
                disabled={loading}
                className="bg-emerald-550 hover:bg-emerald-600 disabled:opacity-40 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Claim"}
              </button>
            </div>

            {/* Watch & Earn Box */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-primary" /> Watch & Earn
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {adStats.todayAdsWatched}/{adStats.dailyLimit} Daily Limit
                </span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-950/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(adStats.todayAdsWatched / adStats.dailyLimit) * 100}%` }}
                />
              </div>

              {/* Ad Simulating Box */}
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-805/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center min-h-[160px] relative overflow-hidden transition-colors">
                {watchingAd ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    <p className="font-bold text-slate-700 dark:text-slate-300 mt-2 text-xs">Playing Sponsor Video...</p>
                    <span className="text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-900 px-3 py-1 rounded-full font-bold mt-1">
                      Time remaining: {adCountdown}s
                    </span>
                  </div>
                ) : (
                  <>
                    <Tv className="w-8 h-8 text-slate-405 dark:text-slate-500 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">Watch a quick 4s video ad</p>
                    <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1">Earns +{adConfig.rewardAmount} Ad Coins immediately</p>
                    <button 
                      onClick={handleWatchAd}
                      className="mt-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Watch Video Ad
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bot Customization Modal */}
      {botModalOpen && (
        <>
          <div 
            onClick={() => setBotModalOpen(false)} 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col gap-6 text-left"
            >
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Bot AI Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Customize opponent capabilities for the match.</p>
              </div>

              {/* Bot Difficulty */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setBotConfig(prev => ({ ...prev, difficulty: diff }))}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${botConfig.difficulty === diff ? "bg-primary border-primary text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-slate-100"}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Personality */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Playing Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {["defensive", "balanced", "aggressive"].map((pers) => (
                    <button
                      key={pers}
                      onClick={() => setBotConfig(prev => ({ ...prev, personality: pers }))}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${botConfig.personality === pers ? "bg-primary border-primary text-white" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-slate-100"}`}
                    >
                      {pers}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setBotModalOpen(false)} 
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStartBotGame}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Start Match
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserLobby;
