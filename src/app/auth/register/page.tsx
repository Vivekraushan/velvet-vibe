"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import supabaseBrowser from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
});

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validation = schema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // redirect after sign up
    router.replace("/feed");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-neutral-900 rounded-xl border border-neutral-800">
      <h1 className="text-2xl font-bold text-center mb-6">Join VelvetVibe</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 outline-none"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button loading={loading}>Create Account</Button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

/* FORCE MODULE */
export {};
