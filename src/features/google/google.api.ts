import { api } from "@/lib/axios";

export async function connectGoogle() {
  const res = await api.get("/google/connect");
  return res.data as { auth_url: string };
}