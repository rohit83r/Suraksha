import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ===============================
   LOGIN (ROLE BASED)
================================= */

export const loginApi = ({ role, ...data }) => {
  if (role === "admin") {
    return API.post("/admin/login", data);
  }
  // default: tourist / user
  return API.post("/tourist/login", data);
};

/* ===============================
   REGISTER (ROLE BASED)
================================= */

export const registerApi = ({ role, ...data }) => {
  if (role === "admin") {
    return API.post("/admin/register", data);
  }
  return API.post("/tourist/register", data);
};

/* ===============================
   TOKEN INTERCEPTOR
================================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
