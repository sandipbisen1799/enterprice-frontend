import api from '../utils/api.js';

export const getAllTournamentsAPI = async (page = 1, limit = 10) => {
  const res = await api.get(`/tournaments?page=${page}&limit=${limit}`);
  return res.data;
};

export const getUpcomingTournamentsAPI = async () => {
  const res = await api.get("/tournaments/upcoming");
  return res.data;
};

export const getActiveTournamentsAPI = async () => {
  const res = await api.get("/tournaments/active");
  return res.data;
};

export const getTournamentDetailsAPI = async (tournamentId) => {
  const res = await api.get(`/tournaments/${tournamentId}`);
  return res.data;
};

export const registerForTournamentAPI = async (tournamentId) => {
  const res = await api.post(`/tournaments/${tournamentId}/register`);
  return res.data;
};

export const getTournamentBracketAPI = async (tournamentId) => {
  const res = await api.get(`/tournaments/${tournamentId}/bracket`);
  return res.data;
};

export const submitTournamentMatchResultAPI = async (tournamentId, matchId, data) => {
  const res = await api.post(`/tournaments/${tournamentId}/matches/${matchId}/result`, data);
  return res.data;
};

export const getPlayerTournamentStatusAPI = async (tournamentId) => {
  const res = await api.get(`/tournaments/${tournamentId}/status`);
  return res.data;
};

export const getTournamentStatsAPI = async () => {
  const res = await api.get("/tournaments/stats");
  return res.data;
};
