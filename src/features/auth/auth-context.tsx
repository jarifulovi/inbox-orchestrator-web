"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "@/lib/axios";
import { supabase } from "@/lib/supabase.client";
import { setToken } from "@/lib/auth-token";

export type MeResponse = {
  user: {
    id: string;
    email: string;
  };
  gmail: {
    connected: boolean;
    accounts: any[];
  };
};

type AuthContextType = {
  me: MeResponse | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const sessionToken = data.session?.access_token;

      if (!sessionToken) {
        setToken(null);
        setMe(null);
        return;
      }

      setToken(sessionToken);

      const res = await api.get<MeResponse>("/auth/me");
      setMe(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setMe(null);
    }
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  useEffect(() => {
    (async () => {
      await fetchMe();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ me, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}