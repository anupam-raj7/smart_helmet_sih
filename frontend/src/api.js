import axios from "axios";
import { io } from "socket.io-client";

export const API_URL = import.meta.env.VITE_API_URL || "http://10.124.220.3:5000";

export const api = axios.create({ baseURL: `${API_URL}/api` });

// One shared socket for the whole app.
export const socket = io(API_URL, { autoConnect: true });

export function getHelmet(helmetId) {
  return api.get(`/helmet/${helmetId}`).then((r) => r.data);
}

export function getEvents(helmetId, limit = 50) {
  return api.get(`/events/${helmetId}`, { params: { limit } }).then((r) => r.data);
}

// Cancel active alerts (used by AlertBanner)
export function simulateCancel(helmetId) {
  return api.post("/cancel", { helmet_id: helmetId });
}
