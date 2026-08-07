import { api } from "@/lib/axios";

export async function connectGoogle(loginHint?: string) {
  const url = loginHint
    ? `/auth/google/connect?login_hint=${encodeURIComponent(loginHint)}`
    : "/auth/google/connect";
  const res = await api.get(url);
  const data = res.data || {};
  return { auth_url: data.auth_url || data.url || "" };
}