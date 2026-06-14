import api from '../utils/api.js';

// Dashboard Analytics
export const getAnalytics = async () => {
  const res = await api.get('/admin/analytics');
  return res.data;
};

// User Management
export const getAdminUsers = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const getAdminUserDetails = async (userId) => {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
};

export const updateAdminUser = async (userId, data) => {
  const res = await api.put(`/admin/users/${userId}`, data);
  return res.data;
};

// Withdrawals Management
export const getPendingWithdrawals = async () => {
  const res = await api.get('/admin/withdrawals/pending');
  return res.data;
};

export const processWithdrawal = async (transactionId, action, notes = '') => {
  const res = await api.post(`/admin/withdrawals/${transactionId}/process`, { action, notes });
  return res.data;
};

// Fraud Detection
export const getFraudReport = async () => {
  const res = await api.get('/admin/fraud-report');
  return res.data;
};

// Tournament Management
export const getTournaments = async () => {
  const res = await api.get('/tournaments');
  return res.data;
};

export const createTournament = async (tournamentData) => {
  const res = await api.post('/tournaments', tournamentData);
  return res.data;
};

export const startTournament = async (tournamentId) => {
  const res = await api.post(`/tournaments/${tournamentId}/start`);
  return res.data;
};

export const cancelTournament = async (tournamentId, reason = '') => {
  const res = await api.post(`/tournaments/${tournamentId}/cancel`, { reason });
  return res.data;
};

// Reward Store - Products
export const getAdminProducts = async (page = 1, limit = 20) => {
  const res = await api.get(`/rewards/admin/products?page=${page}&limit=${limit}`);
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post('/rewards/products', productData);
  return res.data;
};

export const updateProduct = async (productId, productData) => {
  const res = await api.put(`/rewards/products/${productId}`, productData);
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await api.delete(`/rewards/products/${productId}`);
  return res.data;
};

// Reward Store - Orders
export const getAdminOrders = async (status = 'all', page = 1, limit = 20) => {
  const res = await api.get(`/rewards/admin/orders/${status}?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
  const res = await api.put(`/rewards/orders/${orderId}/status`, { status, notes });
  return res.data;
};

export const updateOrderTracking = async (orderId, trackingData) => {
  const res = await api.put(`/rewards/orders/${orderId}/tracking`, trackingData);
  return res.data;
};
