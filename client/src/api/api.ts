// import axios from "axios";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export const userApi = axios.create({
//   baseURL: `${API_URL}/api/user`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export const ownerApi = axios.create({
//   baseURL: `${API_URL}/api/owner`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// export const adminApi = axios.create({
//     baseURL: `${API_URL}/api/admin`,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true,
//   });

// src/api/api.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`, // shared base for /user, /owner, /admin
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
