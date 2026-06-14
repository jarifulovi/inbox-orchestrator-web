import { api } from "@/lib/axios";

export async function connectGoogle() {
  const res = await api.get("/auth/google/connect");
  return res.data as { auth_url: string };
}