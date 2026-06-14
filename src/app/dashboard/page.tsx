"use client";

import { useAuth } from "@/features/auth/auth-context";
import { connectGoogle } from "@/features/google/google.api";

export default function DashboardPage() {
  const { me } = useAuth();

  const handleGoogleConnect = async () => {
    const { auth_url } = await connectGoogle();
    window.location.href = auth_url; // triggers Google consent screen
  };

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="text-gray-600">
        Welcome, {me?.user.email}
      </div>

      <div className="p-4 border rounded-lg space-y-2">
        <div>
          Gmail connected:{" "}
          {me?.gmail.connected ? "Yes" : "No"}
        </div>

        <div>
          Accounts: {me?.gmail.accounts.length}
        </div>

        {/* 👇 THIS IS THE MISSING PIECE */}
        {!me?.gmail.connected && (
          <button
            onClick={handleGoogleConnect}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Connect Google
          </button>
        )}
      </div>
    </div>
  );
}