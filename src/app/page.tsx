// src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth/login");
      }
      else {
        setUser(session.user);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/auth/login");
        }
        else {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}!</h1>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/auth/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Log Out
      </button>
    </div>
  );
}
