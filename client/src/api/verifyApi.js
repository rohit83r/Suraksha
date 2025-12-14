import axios from "axios";

export const getUnverifiedTourists = () => {
  return axios.get("/tourists/unverified");
};

export const approveTourist = (id) => {
  return axios.post(`/tourist/${id}/approve`);
};
