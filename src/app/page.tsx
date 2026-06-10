"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          InboxOrchestrator AI
        </h1>

        <p className="text-gray-600">
          Frontend setup is working 🚀
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => toast.success("UI is working!")}>
            Test Button
          </Button>

          <Button
            variant="outline"
            onClick={() => toast.error("Error test")}
          >
            Test Toast
          </Button>
        </div>
      </div>
    </main>
  );
}