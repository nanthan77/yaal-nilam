/**
 * API Client for Yaal Nilam gateway
 * Handles all REST calls to the Node.js gateway service.
 */

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("yn_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Properties ────────────────────────────────────────────────

export interface PropertyFilters {
  type?: string;
  intent?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  division?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getProperties(filters: PropertyFilters = {}) {
  const { data } = await api.get("/properties", { params: filters });
  return data;
}

export async function getProperty(id: string) {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}

// ── Divisions / Places ────────────────────────────────────────

export async function getDivisions() {
  const { data } = await api.get("/divisions");
  return data;
}

export async function searchPlaces(query: string) {
  const { data } = await api.get("/places/search", { params: { q: query } });
  return data;
}

// ── Agents ────────────────────────────────────────────────────

export async function getAgents() {
  const { data } = await api.get("/agents");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────

export async function login(phone: string, password: string) {
  const { data } = await api.post("/auth/login", { phone, password });
  if (data.token) localStorage.setItem("yn_token", data.token);
  return data;
}

export async function register(payload: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  user_type?: string;
}) {
  const { data } = await api.post("/auth/register", payload);
  if (data.token) localStorage.setItem("yn_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("yn_token");
}

// ── Match Alerts ──────────────────────────────────────────────

export async function getMatchAlerts(phone?: string) {
  const { data } = await api.get("/matching/alerts", {
    params: phone ? { phone } : {},
  });
  return data;
}

export default api;
