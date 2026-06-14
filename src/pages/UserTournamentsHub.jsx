import React, { useState, useEffect } from "react";
import { useApi } from "../context/contextApi";
import { toast } from "react-toastify";
import { 
  Trophy, 
  Award, 
  Users, 
  Calendar, 
  Loader2,
  ChevronRight,
  GitBranch,
  X
} from "lucide-react";
import { 
  getUpcomingTournamentsAPI, 
  getActiveTournamentsAPI, 
  registerForTournamentAPI, 
  getTournamentBracketAPI 
} from "../services/tournament.service";

function UserTournamentsHub() {
  const { checkAuth } = useApi();
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, active
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bracket dialog state
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [bracketData, setBracketData] = useState(null);
  const [bracketLoading, setBracketLoading] = useState(false);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = activeTab === "upcoming" 
        ? await getUpcomingTournamentsAPI() 
        : await getActiveTournamentsAPI();
      
      if (res?.tournaments) {
        setTournaments(res.tournaments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [activeTab]);

  const handleRegister = async (tournamentId) => {
    setLoading(true);
    try {
      const res = await registerForTournamentAPI(tournamentId);
      if (res?.success) {
        toast.success("Successfully registered for the tournament! 🏆");
        fetchTournaments();
        checkAuth();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register. Ensure you have enough coins!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewBracket = async (tournament) => {
    setSelectedTournament(tournament);
    setBracketLoading(true);
    try {
      const res = await getTournamentBracketAPI(tournament._id);
      if (res?.success && res.bracket) {
        setBracketData(res.bracket);
      }
    } catch (err) {
      console.error(err);
      toast.error("Tournament bracket not generated yet!");
      setSelectedTournament(null);
    } finally {
      setBracketLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Tabs list */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "upcoming" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"}`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Upcoming Tourneys
            </span>
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "active" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"}`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Live Tournaments
            </span>
          </button>
        </div>
      </div>

      {/* List items */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((t) => (
            <div 
              key={t._id} 
              className="bg-slate-800/80 border border-slate-700/50 hover:border-slate-550 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all hover:scale-[1.01] hover:bg-slate-800 relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-extrabold text-lg text-slate-200">{t.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider text-indigo-400">{t.gameType}</p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border ${t.status === "registration" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"}`}>
                  {t.status}
                </span>
              </div>

              {/* Tournament meta details */}
              <div className="grid grid-cols-3 gap-2 bg-slate-850/50 border border-slate-750 p-4 rounded-2xl text-center">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Prize Pool</span>
                  <span className="font-black text-emerald-400 text-sm">{t.prizePool} Coins</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Entry Fee</span>
                  <span className="font-black text-amber-400 text-sm">{t.entryFee} Coins</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Players</span>
                  <span className="font-black text-slate-200 text-sm flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {t.currentPlayers} / {t.maxPlayers}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 border-t border-slate-700/35 pt-4">
                <span className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Starts: {new Date(t.startTime).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewBracket(t)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 bg-slate-750 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <GitBranch className="w-3.5 h-3.5" /> Bracket
                  </button>
                  {t.status === "registration" && (
                    <button 
                      onClick={() => handleRegister(t._id)}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-650/10 cursor-pointer"
                    >
                      Join Tourney
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500 font-bold text-xs uppercase tracking-wide">
              No tournaments available in this category
            </div>
          )}
        </div>
      )}

      {/* Bracket Dialog Modal */}
      {selectedTournament && (
        <>
          <div 
            onClick={() => setSelectedTournament(null)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-slate-850 border border-slate-750 w-[95vw] max-w-4xl rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-2xl text-slate-100 flex items-center gap-2">
                    <GitBranch className="w-6 h-6 text-indigo-400" />
                    Tournament Bracket Tree
                  </h3>
                  <p className="text-xs text-slate-455 mt-1">
                    Visual tree lookup of matchups and winners for <span className="text-indigo-400 font-bold">{selectedTournament.name}</span>.
                  </p>
                </div>
                <button onClick={() => setSelectedTournament(null)} className="p-1.5 hover:bg-slate-800 rounded-xl">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {bracketLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              ) : bracketData && bracketData.rounds ? (
                <div className="flex gap-8 overflow-x-auto py-6 min-h-[300px]">
                  {bracketData.rounds.map((round) => (
                    <div key={round.roundNumber} className="flex flex-col gap-6 min-w-[200px]">
                      <h4 className="font-extrabold text-xs text-indigo-400 uppercase tracking-widest text-center border-b border-slate-750 pb-2">
                        Round {round.roundNumber}
                      </h4>
                      <div className="flex flex-col justify-around flex-1 gap-4">
                        {round.matches.map((match) => (
                          <div 
                            key={match.matchId} 
                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 flex flex-col gap-1.5 relative shadow-md shadow-slate-950/20"
                          >
                            {/* Player 1 */}
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className={`line-clamp-1 ${match.winner === match.player1?._id ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                                {match.player1?.name || "TBD"}
                              </span>
                              {match.score && (
                                <span className="text-slate-400 font-bold">{match.score.player1}</span>
                              )}
                            </div>
                            <div className="border-t border-slate-800/80 my-1" />
                            {/* Player 2 */}
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className={`line-clamp-1 ${match.winner === match.player2?._id ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                                {match.player2?.name || "TBD"}
                              </span>
                              {match.score && (
                                <span className="text-slate-400 font-bold">{match.score.player2}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-bold text-xs uppercase tracking-wide">
                  Bracket is not generated yet for this tournament
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserTournamentsHub;
