import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApi } from "../context/contextApi";
import { toast } from "react-toastify";
import { 
  Trophy, 
  ChevronRight, 
  RefreshCw, 
  LogOut, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Circle,
  Sparkles
} from "lucide-react";
import { finishGameAPI, startGameAPI } from "../services/game.service";
import socketManager from "../utils/socket";

// Helper icons for gestures
const handGestures = {
  1: "☝️",
  2: "✌️",
  3: "🤟",
  4: "🍀",
  5: "🖐️",
  6: "✊"
};

function UserGameConsole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, checkAuth, theme } = useApi();

  const isMultiplayer = searchParams.get("multiplayer") === "true";
  const gameMode = searchParams.get("gameMode") || (isMultiplayer ? "multiplayer" : "vs_bot");
  const difficulty = searchParams.get("difficulty") || "medium";
  const personality = searchParams.get("personality") || "balanced";
  const entryFee = parseInt(searchParams.get("entryFee")) || 0;

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core Game State
  const [gameState, setGameState] = useState("toss"); // toss, playing, innings_break, game_over
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerWickets, setPlayerWickets] = useState(0);
  const [opponentWickets, setOpponentWickets] = useState(0);
  const [winner, setWinner] = useState(null);
  
  const [isPlayerBatting, setIsPlayerBatting] = useState(true);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [currentBall, setCurrentBall] = useState(0);
  const [totalBalls] = useState(6);
  const [targetScore, setTargetScore] = useState(null);
  
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [overHistory, setOverHistory] = useState([]); // ball logs e.g. [1, 4, 'W']

  const [tossSelect, setTossSelect] = useState(null); // heads/tails
  const [tossDecision, setTossDecision] = useState(null); // bat/bowl
  const [tossWinner, setTossWinner] = useState(null); // true if player
  const [tossMessage, setTossMessage] = useState("");
  
  const [waitingForMove, setWaitingForMove] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [celebration, setCelebration] = useState(null); // four, six, out, target_met
  
  const [opponentName, setOpponentName] = useState(gameMode === "practice" ? "Nets Bot" : "Express Bot");
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Sockets for multiplayer
  const socketRef = useRef(null);

  // --- BOT AI MOVE DECISION ENGINE ---
  const getBotChoice = (playerLastChoice) => {
    const choices = [1, 2, 3, 4, 5, 6];
    if (difficulty === "easy") {
      return choices[Math.floor(Math.random() * choices.length)];
    }
    
    if (isPlayerBatting) {
      if (playerLastChoice && Math.random() < 0.25) {
        return playerLastChoice; // 25% chance to counter repetitive players
      }
      const bowlerBias = [1, 2, 4, 6, 3, 5];
      const probability = Math.random();
      if (probability < 0.4) return bowlerBias[Math.floor(Math.random() * 3)];
      return choices[Math.floor(Math.random() * choices.length)];
    } else {
      if (playerLastChoice) {
        const safeChoices = choices.filter(c => c !== playerLastChoice);
        return safeChoices[Math.floor(Math.random() * safeChoices.length)];
      }
      return choices[Math.floor(Math.random() * choices.length)];
    }
  };

  // --- TOSS SYSTEM ---
  const handleTossChoose = (choice) => {
    setTossSelect(choice);
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const playerWon = choice === result;
    setTossWinner(playerWon);
    
    if (playerWon) {
      setTossMessage("You won the toss! Choose whether to Bat or Bowl first.");
    } else {
      const botDecidesBat = Math.random() < 0.5;
      setIsPlayerBatting(!botDecidesBat);
      setTossMessage(`Opponent won the toss and decided to ${botDecidesBat ? "Bowl" : "Bat"} first.`);
      setTimeout(() => {
        setGameState("playing");
      }, 3000);
    }
  };

  const handleTossDecision = (decision) => {
    setTossDecision(decision);
    setIsPlayerBatting(decision === "bat");
    setTossMessage(`You decided to ${decision === "bat" ? "Bat" : "Bowl"} first! Starting match...`);
    setTimeout(() => {
      setGameState("playing");
    }, 2000);
  };

  // --- GAMEPLAY MOVE HANDLER ---
  const handlePlayerMove = async (num) => {
    if (isAnimating || waitingForMove || gameState !== "playing") return;
    
    setIsAnimating(true);
    setPlayerChoice(num);

    const botNum = getBotChoice(num);
    setOpponentChoice(botNum);

    // Short delay to build suspense
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsAnimating(false);

    if (num === botNum) {
      // Wicket down!
      setCelebration("out");
      setOverHistory(prev => [...prev, "W"]);
      
      if (isPlayerBatting) {
        setPlayerWickets(1);
        toast.error("OUT! Opponent matched your throw.");
        setTimeout(() => switchInnings(), 2000);
      } else {
        setOpponentWickets(1);
        toast.success("OUT! You matched opponent's throw.");
        setTimeout(() => checkWinnerAfterWicket(), 2000);
      }
    } else {
      // Scored runs
      const runs = isPlayerBatting ? num : botNum;
      setOverHistory(prev => [...prev, runs]);
      
      if (runs === 4) setCelebration("four");
      else if (runs === 6) setCelebration("six");
      else setCelebration(null);

      if (isPlayerBatting) {
        const nextScore = playerScore + runs;
        setPlayerScore(nextScore);
        
        if (targetScore && nextScore >= targetScore) {
          setCelebration("target_met");
          setTimeout(() => endGame("player"), 2000);
          return;
        }
      } else {
        const nextScore = opponentScore + runs;
        setOpponentScore(nextScore);
        
        if (targetScore && nextScore >= targetScore) {
          setTimeout(() => endGame("opponent"), 2000);
          return;
        }
      }

      const nextBall = currentBall + 1;
      setCurrentBall(nextBall);

      if (nextBall >= totalBalls) {
        setTimeout(() => {
          if (currentInnings === 1) {
            switchInnings();
          } else {
            endGame(playerScore > opponentScore ? "player" : "opponent");
          }
        }, 1500);
      }
    }
  };

  const switchInnings = () => {
    setCelebration(null);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setOverHistory([]);
    setCurrentBall(0);
    
    if (currentInnings === 1) {
      setCurrentInnings(2);
      setIsPlayerBatting(!isPlayerBatting);
      const target = isPlayerBatting ? playerScore + 1 : opponentScore + 1;
      setTargetScore(target);
      toast.info(`Innings break! Target set to ${target} runs.`);
    } else {
      endGame(playerScore > opponentScore ? "player" : "opponent");
    }
  };

  const checkWinnerAfterWicket = () => {
    setCelebration(null);
    if (currentInnings === 1) {
      switchInnings();
    } else {
      endGame(playerScore > opponentScore ? "player" : "opponent");
    }
  };

  const endGame = async (matchWinner) => {
    setGameState("game_over");
    let coins = 0;
    
    if (matchWinner === "player") {
      setWinner("player");
      coins = gameMode === "vs100" ? 200 : 50;
      setEarnedCoins(coins);
      toast.success(`VICTORY! You won the match!`);
    } else {
      setWinner("opponent");
      setEarnedCoins(0);
      toast.error("DEFEAT! Better luck next time.");
    }

    try {
      await finishGameAPI(gameId || "local-game", {
        playerScore,
        computerScore: opponentScore,
        winner: matchWinner,
        gameHistory: overHistory,
        rewardCoins: coins
      });
      checkAuth();
    } catch (err) {
      console.error("Failed to register game outcome on server:", err);
    }
  };

  const resetGame = () => {
    setGameState("toss");
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerWickets(0);
    setOpponentWickets(0);
    setIsPlayerBatting(true);
    setCurrentInnings(1);
    setCurrentBall(0);
    setTargetScore(null);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setOverHistory([]);
    setTossSelect(null);
    setTossDecision(null);
    setTossWinner(null);
    setTossMessage("");
    setWinner(null);
    setEarnedCoins(0);
  };

  useEffect(() => {
    if (isMultiplayer && gameId) {
      toast.info("Connecting multiplayer socket server...");
      socketRef.current = socketManager.connect();
      socketRef.current.emit("joinRoom", { gameId });

      socketRef.current.on("gameStateUpdate", (data) => {
        console.log("Socket Update:", data);
      });

      return () => {
        socketManager.disconnect();
      };
    }
  }, [isMultiplayer, gameId]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 relative animate-in fade-in duration-300">
      
      {/* Celebration Overlays */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs pointer-events-none transition-all duration-300">
          <div className="text-center animate-bounce">
            <h1 className={`text-6xl md:text-8xl font-black uppercase tracking-widest ${celebration === "out" ? "text-rose-500" : "text-amber-400"}`}>
              {celebration === "out" ? "OUT!" : celebration === "six" ? "SIXER! 💥" : celebration === "four" ? "FOUR! ⚡" : "WINNER!"}
            </h1>
            <p className="text-white text-base md:text-lg font-bold mt-3 uppercase tracking-wide opacity-90">
              {celebration === "out" ? "Unlucky! A perfect match" : celebration === "six" ? "Shot of the day!" : celebration === "four" ? "Cracking boundary!" : "Target achieved!"}
            </p>
          </div>
        </div>
      )}

      {/* Header bar controls */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm md:text-base capitalize">
              {gameMode.replace("_", " ")} ({difficulty})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Target: {targetScore ? `${targetScore} runs` : "First Innings"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button 
            onClick={() => navigate("/user/lobby")} 
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-200/10 dark:border-rose-900/30 px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" /> Exit Match
          </button>
        </div>
      </div>

      {/* Dynamic Game views */}
      {gameState === "toss" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 flex flex-col items-center gap-8 text-center min-h-[400px] justify-center relative overflow-hidden shadow-xs">
          {/* Decorative gradients */}
          <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[80px]" />
          
          <div className="max-w-md">
            <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase font-bold tracking-widest">
              Coin Flip
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 leading-tight mt-3">
              Toss Control Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Flip the coin or let the opponent start. Winner decides whether to bat or bowl first.
            </p>
            {tossMessage && (
              <p className="mt-4 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2.5 px-4 rounded-xl">
                {tossMessage}
              </p>
            )}
          </div>

          {tossSelect === null ? (
            <div className="flex gap-4">
              <button 
                onClick={() => handleTossChoose("heads")}
                className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-slate-800 dark:text-slate-100 hover:text-white border border-slate-200 dark:border-slate-700 transition-all font-black text-sm flex items-center justify-center shadow-xs cursor-pointer"
              >
                HEADS
              </button>
              <button 
                onClick={() => handleTossChoose("tails")}
                className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-slate-800 dark:text-slate-100 hover:text-white border border-slate-200 dark:border-slate-700 transition-all font-black text-sm flex items-center justify-center shadow-xs cursor-pointer"
              >
                TAILS
              </button>
            </div>
          ) : (
            tossWinner && tossDecision === null && (
              <div className="flex gap-3">
                <button 
                  onClick={() => handleTossDecision("bat")}
                  className="btn-premium text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  BAT FIRST
                </button>
                <button 
                  onClick={() => handleTossDecision("bowl")}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  BOWL FIRST
                </button>
              </div>
            )
          )}
        </div>
      )}

      {gameState === "playing" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main game board */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-6 relative min-h-[350px] shadow-xs">
              
              {/* Batting/Bowling Roles indicator */}
              <div className="absolute top-4 left-4">
                <span className="bg-primary/10 text-primary dark:bg-indigo-500/10 dark:text-indigo-400 border border-primary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  You are {isPlayerBatting ? "Batting" : "Bowling"}
                </span>
              </div>

              {/* Hand gestural display panel */}
              <div className="flex justify-around items-center my-auto">
                {/* Player Throw */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-450 font-bold uppercase tracking-wider">Your Throw</span>
                  <div className={`w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 flex items-center justify-center text-5xl shadow-xs transition-all ${isAnimating ? "animate-pulse scale-95 border-primary" : ""}`}>
                    {playerChoice !== null ? handGestures[playerChoice] : "⏳"}
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                    {playerChoice !== null ? `Runs: ${playerChoice}` : "Waiting..."}
                  </span>
                </div>

                {/* VS Badge */}
                <div className="font-black text-slate-350 dark:text-slate-600 text-lg">VS</div>

                {/* Opponent Throw */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[10px] text-slate-400 dark:text-slate-455 font-bold uppercase tracking-wider">{opponentName}</span>
                  <div className={`w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 flex items-center justify-center text-5xl shadow-xs transition-all ${isAnimating ? "animate-pulse scale-95 border-primary" : ""}`}>
                    {opponentChoice !== null ? handGestures[opponentChoice] : "⏳"}
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                    {opponentChoice !== null ? `Runs: ${opponentChoice}` : "Waiting..."}
                  </span>
                </div>
              </div>

              {/* Over Ball History progression */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-3 text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-450 font-bold uppercase tracking-wider">Over Log</span>
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const ballVal = overHistory[idx];
                    return (
                      <div 
                        key={idx} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                          ballVal === "W" 
                            ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400" 
                            : ballVal !== undefined 
                            ? "bg-primary/10 border-primary text-primary dark:text-indigo-400" 
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                        }`}
                      >
                        {ballVal !== undefined ? ballVal : idx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Input Play controls (1-6) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-center">
                Select your next run number
              </span>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePlayerMove(num)}
                    disabled={isAnimating || waitingForMove}
                    className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary hover:text-white disabled:opacity-40 text-slate-700 dark:text-slate-200 font-black text-base md:text-xl transition-all shadow-xs active:scale-95 flex items-center justify-center cursor-pointer border border-transparent dark:border-slate-750"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Scoreboard sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col justify-between gap-8 min-h-[350px] shadow-xs text-left">
            <div className="flex flex-col gap-6">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 uppercase tracking-wider text-center">
                Broadcast Desk
              </h3>

              {/* Player Score */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase">YOU (BAT)</span>
                  <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{playerScore} / {playerWickets}</h4>
                </div>
                {isPlayerBatting && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
              </div>

              {/* Opponent Score */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
                <div>
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase">{opponentName}</span>
                  <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{opponentScore} / {opponentWickets}</h4>
                </div>
                {!isPlayerBatting && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200/40 dark:border-slate-805/40 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-450">
                <span>Innings:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{currentInnings}/2</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-455">
                <span>Balls remaining:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{totalBalls - currentBall} balls</span>
              </div>
              {targetScore && (
                <div className="flex justify-between text-xs text-slate-505 dark:text-slate-455">
                  <span>Target needed:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{targetScore} runs</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === "game_over" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 flex flex-col items-center gap-8 text-center min-h-[400px] justify-center relative overflow-hidden shadow-xs">
          <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-4xl shadow-md">
            {winner === "player" ? "🏆" : "😭"}
          </div>
          
          <div className="max-w-sm">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {winner === "player" ? "Victory!" : "Defeat!"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Final score: You {playerScore} runs, {opponentName} {opponentScore} runs.
            </p>
            {winner === "player" && earnedCoins > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-full mt-4 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                🪙 Credited +{earnedCoins} Reward Coins
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={resetGame}
              className="btn-premium text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Rematch
            </button>
            <button 
              onClick={() => navigate("/user/lobby")} 
              className="bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Exit Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserGameConsole;
