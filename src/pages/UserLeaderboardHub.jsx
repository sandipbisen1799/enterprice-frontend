import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Award, 
  Gamepad2, 
  Loader2,
  Sparkles
} from "lucide-react";
import { getLeaderboardAPI } from "../services/game.service";

function UserLeaderboardHub() {
  const [activeTab, setActiveTab] = useState("wins"); // wins, score, games
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboardAPI(activeTab, 25);
      if (Array.isArray(data)) {
        setLeaderboard(data);
      } else if (data?.data) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* Tab Filter */}
      <div className="flex gap-2 p-1 bg-slate-800 border border-slate-700/50 rounded-2xl">
        <button
          onClick={() => setActiveTab("wins")}
          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "wins" ? "bg-slate-900 text-yellow-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Trophy className="w-4 h-4" /> Most Wins
        </button>
        <button
          onClick={() => setActiveTab("score")}
          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "score" ? "bg-slate-900 text-blue-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Sparkles className="w-4 h-4" /> High Score
        </button>
        <button
          onClick={() => setActiveTab("games")}
          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === "games" ? "bg-slate-900 text-purple-400 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
        >
          <Gamepad2 className="w-4 h-4" /> Games Played
        </button>
      </div>

      {/* Ranks list */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            
            {/* Table headers */}
            <div className="flex justify-between items-center text-slate-500 font-bold text-xs uppercase tracking-wider px-4 border-b border-slate-700/50 pb-2">
              <div className="flex gap-8">
                <span className="w-8 text-center">Rank</span>
                <span>Player Details</span>
              </div>
              <span className="text-right">
                {activeTab === "wins" ? "Wins" : activeTab === "score" ? "High Score" : "Total Matches"}
              </span>
            </div>

            {leaderboard.map((player, index) => {
              const rank = index + 1;
              const isPodium = rank <= 3;
              const podiumEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" };
              const podiumColors = { 
                1: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400", 
                2: "bg-slate-300/10 border-slate-300/20 text-slate-300", 
                3: "bg-amber-600/10 border-amber-600/20 text-amber-500" 
              };

              return (
                <div 
                  key={player._id} 
                  className={`flex justify-between items-center px-4 py-3 rounded-2xl border transition-all ${
                    isPodium 
                      ? `${podiumColors[rank]} scale-[1.01]` 
                      : "bg-slate-850/30 border-slate-750 text-slate-200 hover:border-slate-650"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    {/* Rank Indicator */}
                    <span className="w-8 text-center font-black text-sm">
                      {isPodium ? podiumEmojis[rank] : rank}
                    </span>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={player.imageUrl || player.avatar || "https://via.placeholder.com/150"} 
                        alt={player.name} 
                        className="w-9 h-9 rounded-full object-cover border border-slate-700/40" 
                      />
                      <div>
                        <h4 className="font-extrabold text-sm line-clamp-1">{player.name}</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">Joined Arena: {new Date(player.joinedAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rank score value */}
                  <span className="font-black text-right pr-2">
                    {activeTab === "wins" ? player.totalWins : activeTab === "score" ? player.highestScore : player.totalGames}
                  </span>
                </div>
              );
            })}

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-bold text-xs uppercase tracking-wide">
                Leaderboard statistics loading...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLeaderboardHub;
