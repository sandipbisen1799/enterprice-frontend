import api from '../utils/api.js';

export const recordAdImpressionAPI = async (data) => {
  const res = await api.post("/ads/impression", data);
  return res.data;
};

export const recordAdCompletionAPI = async (adId) => {
  const res = await api.post(`/ads/complete/${adId}`);
  return res.data;
};

export const getAdStatsAPI = async () => {
  const res = await api.get("/ads/stats");
  return res.data;
};

export const getAdConfigAPI = async () => {
  const res = await api.get("/ads/config");
  return res.data;
};

export const claimFreeCoinsAPI = async () => {
  const res = await api.post("/ads/free-coins");
  return res.data;
};
