import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/contextApi";
import { 
  Trophy, 
  Tv, 
  Gift, 
  ShieldAlert, 
  Gamepad2, 
  Compass, 
  Zap, 
  Sparkles,
  Loader2,
  AlertCircle
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
  const { checkAuth } = useApi();
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
      // 1. Create ad impression
      const impression = await recordAdImpressionAPI({
        adType: "rewarded",
        adNetwork: "admob",
        adUnitId: "ca-app-pub-3940256099942544/5224354917"
      });

      const impressionId = impression.impressionId || impression.data?.impressionId;

      // 2. Countdown simulation
      const countdownInterval = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Wait for 4s
      await new Promise(resolve => setTimeout(resolve, 4000));

      // 3. Complete ad impression to credit coins
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
    <div className="flex flex-col gap-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-600/10">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-radial-gradient pointer-events-none" />
        <div className="max-w-xl">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
            Hand Cricket Arena
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 leading-tight">
            Strike numbers, score runs, and earn real rewards!
          </h2>
          <p className="text-slate-200 mt-2 text-sm md:text-base opacity-90">
            Pick a game mode below to match against a bot or other active online users.
          </p>
        </div>
      </div>

      {/* Grid: Lobbies & Ad Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Play Modes Selection Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="font-extrabold text-2xl tracking-wide flex items-center gap-2 text-slate-100">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            Select Game Mode
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Practice Card */}
            <div className="bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] hover:bg-slate-800 group">
              <div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Compass className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-extrabold text-lg mt-4 text-slate-200">Practice Nets</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Learn the timing, controls, and scoring mechanics with zero stakes.
                </p>
              </div>
              <button onClick={handleStartPractice} className="w-full bg-slate-700 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                Enter Nets
              </button>
            </div>

            {/* VS Computer Bot Card */}
            <div className="bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] hover:bg-slate-800 group">
              <div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-extrabold text-lg mt-4 text-slate-200">VS Computer</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Challenge our custom Bot AI. Select bot personalities and dynamic difficulty settings.
                </p>
              </div>
              <button onClick={() => setBotModalOpen(true)} className="w-full bg-slate-700 hover:bg-yellow-500 hover:text-slate-950 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                Choose Config
              </button>
            </div>

            {/* VS 100 Mode Card */}
            <div className="bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] hover:bg-slate-800 group">
              <div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-extrabold text-lg mt-4 text-slate-200">VS 100 Arena</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pay 100 Entry Fee to match with challenging high-AI bots. Double stakes, double rewards.
                </p>
              </div>
              <button onClick={handleStartVs100} className="w-full bg-slate-700 hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                Join VS 100 (100 AD)
              </button>
            </div>

            {/* Premium Matchmaking Multiplayer Card */}
            <div className="bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:scale-[1.02] hover:bg-slate-800 group relative overflow-hidden">
              {inQueue && (
                <div className="absolute inset-0 bg-indigo-950/90 flex flex-col items-center justify-center gap-3 z-10 p-5">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-slate-200 text-sm">Searching for opponents...</p>
                    <p className="text-xs text-slate-400 mt-0.5">Elapsed time: {queueTime}s</p>
                  </div>
                  <button onClick={handleToggleQueue} className="mt-2 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 rounded-full transition-all">
                    Cancel Matchmaking
                  </button>
                </div>
              )}
              <div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Trophy className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-lg mt-4 text-slate-200">Real-time Multiplayer</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Match instantly with other real online players in real-time. Turn-based Socket.IO gameplay.
                </p>
              </div>
              <button onClick={handleToggleQueue} className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                Find Quick Match
              </button>
            </div>
          </div>
        </div>

        {/* Earning Center Widget Card */}
        <div className="flex flex-col gap-6">
          <h2 className="font-extrabold text-2xl tracking-wide flex items-center gap-2 text-slate-100">
            <Gift className="w-6 h-6 text-emerald-400" />
            Earning Station
          </h2>

          <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 flex flex-col gap-6">
            
            {/* Daily Claim Reward */}
            <div className="bg-slate-750 border border-slate-700/40 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-200">Daily Attendance Claim</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Free attendance coins daily.</p>
              </div>
              <button 
                onClick={handleClaimFreeCoins}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Claim"}
              </button>
            </div>

            {/* Watched Sponsor Ads */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-200 text-base flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-indigo-400" /> Watch & Earn
                </h3>
                <span className="text-xs text-slate-400">
                  {adStats.todayAdsWatched} / {adStats.dailyLimit} Ads Watched
                </span>
              </div>
              <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(adStats.todayAdsWatched / adStats.dailyLimit) * 100}%` }}
                />
              </div>

              {/* Ad watched simulator box */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[140px]">
                {watchingAd ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="font-bold text-slate-200 mt-2 text-sm">Loading Sponsored Clip...</p>
                    <p className="text-xs text-slate-400">Simulating player watch countdown: {adCountdown}s</p>
                  </div>
                ) : (
                  <>
                    <Tv className="w-10 h-10 text-slate-600 mb-2" />
                    <p className="font-bold text-slate-300 text-xs">Watch a quick 4-second video ad</p>
                    <p className="text-[10px] text-slate-500 mt-1">Earns +{adConfig.rewardAmount} Ad Coins immediately</p>
                    <button 
                      onClick={handleWatchAd}
                      className="mt-4 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-650/20"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-slate-850 border border-slate-750 w-[90vw] max-w-md rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-6"
            >
              <div>
                <h3 className="font-black text-2xl text-slate-100 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Bot AI Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-1">Customise bot properties to challenge yourself.</p>
              </div>

              {/* Bot Difficulty */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setBotConfig(prev => ({ ...prev, difficulty: diff }))}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${botConfig.difficulty === diff ? "bg-indigo-650 border-indigo-500 text-white" : "bg-slate-800 border-slate-700/50 text-slate-400 hover:text-slate-200"}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Personality */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Playing Personality</label>
                <div className="grid grid-cols-3 gap-2">
                  {["defensive", "balanced", "aggressive"].map((pers) => (
                    <button
                      key={pers}
                      onClick={() => setBotConfig(prev => ({ ...prev, personality: pers }))}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${botConfig.personality === pers ? "bg-indigo-650 border-indigo-500 text-white" : "bg-slate-800 border-slate-700/50 text-slate-400 hover:text-slate-200"}`}
                    >
                      {pers}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setBotModalOpen(false)} 
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700/50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStartBotGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-500/10"
                >
                  Start Game
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
