import axios from "axios";

const api = axios.create({
  // baseURL:"https://ciger-backend-2.onrender.com",
  // baseURL:"http://localhost:5001",
  baseURL: "https://backend.smokenza.com",
  withCredentials: true, // optional
});

export default api;
