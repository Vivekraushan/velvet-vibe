
"use client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseBrowser from "@/lib/supabaseBrowser";


export default function RegisterPage() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof supabaseBrowser> | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabaseRef.current = supabaseBrowser();
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!supabaseRef.current) return;

    const { error } = await supabaseRef.current.auth.signUp({
      email,
      password,
    });

    if (!error) router.push("/feed");
  }

  return (
    <form onSubmit={handleRegister}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
