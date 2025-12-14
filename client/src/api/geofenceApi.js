import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true
});

export const getActiveGeofences = () =>
  API.get(`/geofences?active=true`);

export const sendLocationUpdate = (data) =>
  API.post(`/location/update`, data);

export const saveGeofence = (data) =>
  API.post("/geofences", data); 

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