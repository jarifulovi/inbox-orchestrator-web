import axios from "axios";
import { supabase } from "@/lib/supabase.client";
import { getToken } from "@/lib/auth-token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});


api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});