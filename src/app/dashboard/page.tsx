"use client";

import { useAuth } from "@/features/auth/auth-context";

export default function DashboardPage() {
  const { me } = useAuth();

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">
        Dashboard
      </h1>

      <div className="text-gray-600">
        Welcome, {me?.user.email}
      </div>

      <div className="p-4 border rounded-lg">
        <div>Gmail connected: {me?.gmail.connected ? "Yes" : "No"}</div>
        <div>Accounts: {me?.gmail.accounts.length}</div>
      </div>
    </div>
  );
}