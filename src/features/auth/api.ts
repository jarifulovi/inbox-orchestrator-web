import { supabase } from "@/lib/supabase.client";

export const authApi = {
  // -------------------------
  // SIGN UP (create Supabase user)
  // -------------------------
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  // -------------------------
  // SIGN IN
  // -------------------------
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },
  // -------------------------
  // Get current session
  // -------------------------
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // -------------------------
  // SIGN OUT
  // -------------------------
  signOut: async () => {
    return await supabase.auth.signOut();
  },
};