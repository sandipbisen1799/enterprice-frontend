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
  HelpCircle
} from "lucide-react";
import { finishGameAPI, startGameAPI } from "../services/game.service";
import socketManager from "../utils/socket";

// Helper icons for gestures (Unicode emojis or styled divs)
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
  const { user, checkAuth } = useApi();

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
  
  const [isPlayerBatting, setIsPlayerBatting] = useState(true);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [currentBall, setCurrentBall] = useState(0);
  const [totalBalls] = useState(6);
  const [targetScore, setTargetScore] = useState(null);
  
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [overHistory, setOverHistory] = useState([]); // dots showing historical balls e.g. [1, 4, 'OUT']

  const [tossSelect, setTossSelect] = useState(null); // heads/tails
  const [tossDecision, setTossDecision] = useState(null); // bat/bowl
  const [tossWinner, setTossWinner] = useState(null); // true if player, false if bot/opponent
  const [tossMessage, setTossMessage] = useState("");
  
  const [waitingForMove, setWaitingForMove] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [celebration, setCelebration] = useState(null); // four, six, out, target_met
  
  const [opponentName, setOpponentName] = useState(gameMode === "practice" ? "Nets Bot" : "Express Bot");
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Sockets for multiplayer
  const socketRef = useRef(null);
  const gameIdRef = useRef(gameId);

  // --- BOT AI MOVE DECISION ENGINE ---
  const getBotChoice = (playerLastChoice) => {
    // Generate AI choices based on difficulty/personality
    const choices = [1, 2, 3, 4, 5, 6];
    if (difficulty === "easy") {
      return choices[Math.floor(Math.random() * choices.length)];
    }
    
    // Medium/Hard AI tries to guess or pick strategic runs
    if (isPlayerBatting) {
      // Bot is bowling, wants to guess player's choice
      if (playerLastChoice && Math.random() < 0.25) {
        return playerLastChoice; // 25% chance to guess last choice (counters repetitive players)
      }
      // Pick common batting numbers
      const bowlerBias = [1, 2, 4, 6, 3, 5];
      const probability = Math.random();
      if (probability < 0.4) return bowlerBias[Math.floor(Math.random() * 3)];
      return choices[Math.floor(Math.random() * choices.length)];
    } else {
      // Bot is batting, wants to score high but avoid matching
      if (playerLastChoice) {
        // Avoid what the bowler did last time
        const safeChoices = choices.filter(c => c !== playerLastChoice);
        return safeChoices[Math.floor(Math.random() * safeChoices.length)];
      }
      return choices[Math.floor(Math.random() * choices.length)];
    }
  };

  // --- TOSS FLIP SYSTEM ---
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
      setTossMessage(`Bot won the toss and decided to ${botDecidesBat ? "Bowl" : "Bat"} first.`);
      setTimeout(() => {
        setGameState("playing");
      }, 3000);
    }
  };

  const handleTossDecision = (decision) => {
    setTossDecision(decision);
    setIsPlayerBatting(decision === "bat");
    setTossMessage(`You decided to ${decision === "bat" ? "Bat" : "Bowl"} first! Match starting...`);
    setTimeout(() => {
      setGameState("playing");
    }, 2000);
  };

  // --- PLAY SINGLE MOVE LOOP ---
  const handlePlayerMove = async (num) => {
    if (isAnimating || waitingForMove || gameState !== "playing") return;
    
    setIsAnimating(true);
    setPlayerChoice(num);

    // Get Bot counter choice
    const botNum = getBotChoice(num);
    setOpponentChoice(botNum);

    // Gesture animation delay simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnimating(false);

    // Compute outcome
    if (num === botNum) {
      // OUT!
      setCelebration("out");
      setOverHistory(prev => [...prev, "W"]);
      
      if (isPlayerBatting) {
        setPlayerWickets(1);
        toast.error("OUT! You lost your wicket!");
        // End of player's batting innings
        setTimeout(() => switchInnings(), 2000);
      } else {
        setOpponentWickets(1);
        toast.success("OUT! You took a wicket!");
        // End of bot's batting innings
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
        
        // Target chasing checks
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

      // Check ball count limit
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
      
      // Calculate target
      const target = isPlayerBatting ? playerScore + 1 : opponentScore + 1;
      setTargetScore(target);
      toast.info(`Innings break! Chasing Target: ${target} runs.`);
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

  // --- END GAME & CREDIT BALANCE ---
  const endGame = async (matchWinner) => {
    setGameState("game_over");
    let coins = 0;
    
    if (matchWinner === "player") {
      setWinner("player");
      coins = gameMode === "vs100" ? 200 : 50;
      setEarnedCoins(coins);
      toast.success(`VICTORY! You won the match and earned ${coins} coins!`);
    } else {
      setWinner("opponent");
      setEarnedCoins(0);
      toast.error("DEFEAT! Bot won the match.");
    }

    // Call backend finish game to store records & credit balances
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

  // --- MULTIPLAYER ROOM HANDLER ---
  useEffect(() => {
    if (isMultiplayer && gameId) {
      toast.info("Connecting multiplayer socket server...");
      socketRef.current = socketManager.connect();
      
      socketRef.current.emit("joinRoom", { gameId });

      socketRef.current.on("gameStateUpdate", (data) => {
        console.log("Socket Update:", data);
        // Map socket state variables to console parameters
      });

      return () => {
        socketManager.disconnect();
      };
    }
  }, [isMultiplayer, gameId]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 relative">
      
      {/* Celebration Overlays */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none">
          <div className="text-center animate-bounce">
            <h1 className={`text-6xl md:text-8xl font-black uppercase tracking-widest ${celebration === "out" ? "text-rose-500 text-shadow-glow-rose" : "text-yellow-400 text-shadow-glow"}`}>
              {celebration === "out" ? "OUT!" : celebration === "six" ? "SIXER! 🏏" : celebration === "four" ? "FOUR! 🏏" : "TARGET MET!"}
            </h1>
            <p className="text-white text-lg font-bold mt-2 uppercase tracking-wide">
              {celebration === "out" ? "Wicket down" : celebration === "six" ? "Superb shot over the ropes" : celebration === "four" ? "Smash through the covers" : "Chase complete!"}
            </p>
          </div>
        </div>
      )}

      {/* Header bar controls */}
      <div className="flex justify-between items-center bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-indigo-400" />
          <div>
            <h3 className="font-extrabold text-slate-100 text-sm md:text-base capitalize">
              {gameMode.replace("_", " ")} Mode ({difficulty})
            </h3>
            <p className="text-xs text-slate-400">Target: {targetScore || "First Innings"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-slate-750 rounded-xl transition-all border border-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <button 
            onClick={() => navigate("/user/lobby")} 
            className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit Lobby
          </button>
        </div>
      </div>

      {/* Dynamic Game views */}
      {gameState === "toss" && (
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-8 text-center min-h-[400px] justify-center relative overflow-hidden">
          <div className="max-w-md">
            <h2 className="text-3xl font-black text-slate-100 leading-tight">
              Toss Control Center
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Flip the coin or let the opponent start. Winner decides batting first.
            </p>
            {tossMessage && (
              <p className="mt-4 text-sm font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 py-2.5 px-4 rounded-xl">
                {tossMessage}
              </p>
            )}
          </div>

          {tossSelect === null ? (
            <div className="flex gap-4">
              <button 
                onClick={() => handleTossChoose("heads")}
                className="w-28 h-28 rounded-full bg-slate-700 hover:bg-indigo-600 border border-slate-600 transition-all font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                HEADS
              </button>
              <button 
                onClick={() => handleTossChoose("tails")}
                className="w-28 h-28 rounded-full bg-slate-700 hover:bg-indigo-600 border border-slate-600 transition-all font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                TAILS
              </button>
            </div>
          ) : (
            tossWinner && tossDecision === null && (
              <div className="flex gap-4">
                <button 
                  onClick={() => handleTossDecision("bat")}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  BAT FIRST
                </button>
                <button 
                  onClick={() => handleTossDecision("bowl")}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer border border-slate-600"
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
            <div className="bg-slate-850 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6 relative min-h-[350px]">
              
              {/* Batting/Bowling Roles indicator */}
              <div className="absolute top-4 left-4">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  You are {isPlayerBatting ? "Batting" : "Bowling"}
                </span>
              </div>

              {/* Hand gestural display panel */}
              <div className="flex justify-around items-center my-auto">
                {/* Player Throw */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your Throw</span>
                  <div className={`w-28 h-28 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-6xl shadow-xl transition-all ${isAnimating ? "animate-pulse scale-95" : ""}`}>
                    {playerChoice !== null ? handGestures[playerChoice] : "⏳"}
                  </div>
                  <span className="font-bold text-slate-200 text-sm">
                    {playerChoice !== null ? `Runs: ${playerChoice}` : "Waiting"}
                  </span>
                </div>

                {/* VS Badge */}
                <div className="font-black text-slate-600 text-2xl">VS</div>

                {/* Opponent Throw */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{opponentName}</span>
                  <div className={`w-28 h-28 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-6xl shadow-xl transition-all ${isAnimating ? "animate-pulse scale-95" : ""}`}>
                    {opponentChoice !== null ? handGestures[opponentChoice] : "⏳"}
                  </div>
                  <span className="font-bold text-slate-200 text-sm">
                    {opponentChoice !== null ? `Runs: ${opponentChoice}` : "Waiting"}
                  </span>
                </div>
              </div>

              {/* Over Ball History progression */}
              <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Over Log</span>
                <div className="flex gap-2.5">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const ballVal = overHistory[idx];
                    return (
                      <div 
                        key={idx} 
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                          ballVal === "W" 
                            ? "bg-rose-500/20 border-rose-500 text-rose-300" 
                            : ballVal !== undefined 
                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" 
                            : "bg-slate-800 border-slate-700 text-slate-500"
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
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 flex flex-col gap-4">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">
                Choose your play number
              </span>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePlayerMove(num)}
                    disabled={isAnimating || waitingForMove}
                    className="aspect-square rounded-2xl bg-slate-700 hover:bg-indigo-650 disabled:opacity-40 text-slate-100 font-black text-xl md:text-2xl transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Scoreboard sidebar */}
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-6 flex flex-col justify-between gap-8 min-h-[400px]">
            <div className="flex flex-col gap-6">
              <h3 className="font-extrabold text-slate-100 text-lg border-b border-slate-700/50 pb-3 uppercase tracking-wider text-center">
                Scoreboard Broadcast
              </h3>

              {/* Player Score */}
              <div className="flex justify-between items-center bg-slate-750/50 p-4 rounded-2xl border border-slate-700/30">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">YOU (BAT)</span>
                  <h4 className="text-2xl font-black text-slate-200 mt-1">{playerScore} / {playerWickets}</h4>
                </div>
                {isPlayerBatting && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
              </div>

              {/* Opponent Score */}
              <div className="flex justify-between items-center bg-slate-750/50 p-4 rounded-2xl border border-slate-700/30">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase">{opponentName}</span>
                  <h4 className="text-2xl font-black text-slate-200 mt-1">{opponentScore} / {opponentWickets}</h4>
                </div>
                {!isPlayerBatting && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
              </div>
            </div>

            <div className="bg-slate-850/50 p-4 rounded-2xl border border-slate-750 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Innings:</span>
                <span className="font-bold text-slate-200">{currentInnings} / 2</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Balls Remaining:</span>
                <span className="font-bold text-slate-200">{totalBalls - currentBall} balls</span>
              </div>
              {targetScore && (
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Target needed:</span>
                  <span className="font-bold text-yellow-400">{targetScore} runs</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === "game_over" && (
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center gap-8 text-center min-h-[400px] justify-center relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-5xl">
            {winner === "player" ? "🏆" : "😭"}
          </div>
          
          <div className="max-w-sm">
            <h2 className="text-3xl font-black text-slate-100 uppercase tracking-wide">
              {winner === "player" ? "Match Won!" : "Match Lost!"}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Final score: You {playerScore} runs, {opponentName} {opponentScore} runs.
            </p>
            {winner === "player" && earnedCoins > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-full mt-4 text-emerald-400 font-extrabold text-sm shadow-md shadow-emerald-500/5">
                🪙 Earned +{earnedCoins} Coins Credited
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={resetGame}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Rematch
            </button>
            <button 
              onClick={() => navigate("/user/lobby")} 
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-extrabold text-sm px-6 py-3 rounded-xl transition-all cursor-pointer border border-slate-600"
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
