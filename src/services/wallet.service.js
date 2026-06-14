import api from '../utils/api.js';

export const getWalletBalanceAPI = async () => {
  const res = await api.get("/wallet/balance");
  return res.data;
};

export const getTransactionHistoryAPI = async (page = 1, limit = 20) => {
  const res = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
  return res.data;
};

export const convertCoinsAPI = async (data) => {
  const res = await api.post("/wallet/convert", data);
  return res.data;
};

export const requestWithdrawalAPI = async (data) => {
  const res = await api.post("/wallet/withdraw", data);
  return res.data;
};

export const startConversionMatchAPI = async () => {
  const res = await api.post("/wallet/start-conversion-match");
  return res.data;
};
