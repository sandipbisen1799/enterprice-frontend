import api from '../utils/api.js';

export const getAllProductsAPI = async (page = 1, limit = 20) => {
  const res = await api.get(`/rewards/products?page=${page}&limit=${limit}`);
  return res.data;
};

export const getFeaturedProductsAPI = async () => {
  const res = await api.get("/rewards/products/featured");
  return res.data;
};

export const getProductsByCategoryAPI = async (category) => {
  const res = await api.get(`/rewards/products/category/${category}`);
  return res.data;
};

export const getProductDetailsAPI = async (productId) => {
  const res = await api.get(`/rewards/products/${productId}`);
  return res.data;
};

export const getProductCategoriesAPI = async () => {
  const res = await api.get("/rewards/categories");
  return res.data;
};

export const createOrderAPI = async (data) => {
  const res = await api.post("/rewards/orders", data);
  return res.data;
};

export const getUserOrdersAPI = async (page = 1, limit = 20) => {
  const res = await api.get(`/rewards/orders?page=${page}&limit=${limit}`);
  return res.data;
};

export const getOrderDetailsAPI = async (orderId) => {
  const res = await api.get(`/rewards/orders/${orderId}`);
  return res.data;
};
