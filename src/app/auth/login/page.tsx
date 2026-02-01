"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabaseBrowser from "@/lib/supabaseBrowser";


export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/feed");
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <input value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
