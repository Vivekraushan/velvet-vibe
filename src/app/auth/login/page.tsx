
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseBrowser from "@/lib/supabaseBrowser";


export default function LoginPage() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof supabaseBrowser> | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ create Supabase ONLY on client, AFTER mount
  useEffect(() => {
    supabaseRef.current = supabaseBrowser();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseRef.current) return;

    const { error } = await supabaseRef.current.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/feed");
  }

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
