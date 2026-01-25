"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabaseBrowser from "@/lib/supabaseBrowser";

type SupabaseAuthContextType = {
  user: User | null;
  loading: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  loading: true,
});

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseBrowser();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  return useContext(SupabaseAuthContext);
}
