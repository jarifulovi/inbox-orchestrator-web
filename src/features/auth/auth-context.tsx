"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "@/lib/axios";
import { authApi } from "./api";
import { setToken } from "@/lib/auth-token";
import { supabase } from "@/lib/supabase.client";

export type ConnectedAccount = {
  id: string;
  provider: string;
  email: string;
  is_active: boolean;
  sync: {
    mode: string | null;
    cursor: string | null;
    last_sync_at: string | null;
  };
};

export type MeResponse = {
  user: {
    id: string;
    email: string;
  };
  gmail: {
    connected: boolean;
    accounts: ConnectedAccount[];
  };
};

type AuthContextType = {
  me: MeResponse | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  selectedAccount: ConnectedAccount | null;
  setSelectedAccount: (account: ConnectedAccount | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);

  useEffect(() => {
    if (me?.gmail?.accounts && me.gmail.accounts.length > 0) {
      const stillExists = me.gmail.accounts.some(acc => acc.id === selectedAccount?.id);
      if (!selectedAccount || !stillExists) {
        setSelectedAccount(me.gmail.accounts[0]);
      }
    } else {
      setSelectedAccount(null);
    }
  }, [me, selectedAccount]);

  const fetchMe = async () => {
    try {
      const { data } = await authApi.getSession();
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
    let mounted = true;

    const init = async () => {
      await fetchMe();
      if (mounted) setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const token = session?.access_token ?? null;

        setToken(token);

        if (!token) {
          setMe(null);
          return;
        }

        try {
          const res = await api.get<MeResponse>("/auth/me");
          setMe(res.data);
        } catch (err) {
          console.error("Auth state change /me failed:", err);
          setMe(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ me, loading, refreshUser, selectedAccount, setSelectedAccount }}>
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