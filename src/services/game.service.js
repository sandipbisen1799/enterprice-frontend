import api from '../utils/api.js';

export const startGameAPI = async (data) => {
  const res = await api.post("/games/start", data);
  return res.data;
};

export const finishGameAPI = async (gameId, data) => {
  const res = await api.post(`/games/finish/${gameId}`, data);
  return res.data;
};

export const getGameHistoryAPI = async (page = 1, limit = 10) => {
  const res = await api.get(`/games/history?page=${page}&limit=${limit}`);
  return res.data;
};

export const getGameStatsAPI = async () => {
  const res = await api.get("/games/stats");
  return res.data;
};

export const getLeaderboardAPI = async (type = 'wins', limit = 50) => {
  const res = await api.get(`/games/leaderboard?type=${type}&limit=${limit}`);
  return res.data;
};

export const startFunModeAPI = async (payload) => {
  const res = await api.post("/games/fun/start", payload);
  return res.data;
};

export const leaveFunModeAPI = async () => {
  const res = await api.post("/games/fun/leave");
  return res.data;
};

export const getMatchmakingStatusAPI = async () => {
  const res = await api.get("/games/fun/status");
  return res.data;
};

export const makeMoveAPI = async (gameId, moveData) => {
  const res = await api.post(`/games/move/${gameId}`, { moveData });
  return res.data;
};

// Multiplayer Rooms
export const createRoomAPI = async (data) => {
  const res = await api.post("/games/rooms/create", data);
  return res.data;
};

export const joinRoomAPI = async (roomCode, password) => {
  const res = await api.post(`/games/rooms/join/${roomCode}`, { password });
  return res.data;
};

export const getRoomDetailsAPI = async (roomCode) => {
  const res = await api.get(`/games/rooms/${roomCode}`);
  return res.data;
};

export const setPlayerReadyAPI = async (roomCode, isReady) => {
  const res = await api.post(`/games/rooms/${roomCode}/ready`, { isReady });
  return res.data;
};

export const sendRoomMessageAPI = async (roomCode, message) => {
  const res = await api.post(`/games/rooms/${roomCode}/message`, { message });
  return res.data;
};

export const leaveRoomAPI = async (roomCode) => {
  const res = await api.post(`/games/rooms/${roomCode}/leave`);
  return res.data;
};

export const getAvailableRoomsAPI = async (gameType, status = 'waiting') => {
  let url = `/games/rooms?status=${status}`;
  if (gameType) url += `&gameType=${gameType}`;
  const res = await api.get(url);
  return res.data;
};
