"use client";

import { useSupabaseAuth } from "@/lib/supabaseSessionProvider";
import Link from "next/link";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();

  if (loading) return <p className="text-gray-400">Loading...</p>;

  if (!user) {
    return (
      <div className="text-center space-y-4 py-10">
        <h2 className="text-2xl font-semibold">You must be logged in.</h2>
        <Link
          href="/auth/login"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
