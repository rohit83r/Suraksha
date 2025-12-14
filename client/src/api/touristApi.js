import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true
});

export const getUserProfile = () => API.get("/tourist/profile");
export const updateProfile = (data) => API.put("/tourist/profile", data);
export const deleteProfile = () => API.delete("/tourist/profile");

export const updateEmergencyContacts = (contacts) =>
  API.put("/tourist/emergency-contacts", { contacts });

/* ===============================
   EMERGENCY CONTACT APIs
   =============================== */

/**
 * Add emergency contact
 * POST /emergency-contacts
 */
export const addEmergencyContact = async (data) => {
  const res = await API.post("/tourist/emergency-contacts", data);
  return res.data;
};

/**
 * Update emergency contact
 * PUT /emergency-contacts/:id
 */
export const updateEmergencyContact = async (id, data) => {
  const res = await API.put(`/tourist/emergency-contacts/${id}`, data);
  return res.data;
};

/**
 * Delete emergency contact
 * DELETE /emergency-contacts/:id
 */
export const deleteEmergencyContact = async (id) => {
  const res = await API.delete(`/tourist/emergency-contacts/${id}`);
  return res.data;
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