import { api } from "@/lib/axios";

export async function connectGoogle(loginHint?: string) {
  const url = loginHint
    ? `/auth/google/connect?login_hint=${encodeURIComponent(loginHint)}`
    : "/auth/google/connect";
  const res = await api.get(url);
  return res.data as { auth_url: string };
}