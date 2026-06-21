import axios from "axios";

const getBaseURL = () => {
  const url = "http://localhost:8888";
  return url.endsWith("/api") ? url : `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(), 
  withCredentials: true,                   
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
