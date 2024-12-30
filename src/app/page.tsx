// src/app/page.tsx
"use client";

import React, { useState } from "react";
import { signUp, signIn } from "@/lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);
    if (error) {
      setMessage(`Sign-up failed: ${error.message}`);
    } else {
      setMessage("Sign up successful! Please log in.");
    }
  }

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      setMessage(`Log-in failed: ${error.message}`);
    } else {
      setMessage("Log in successful!");
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to SaaS Core</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-64"
      />
      <div className="flex gap-4">
        <button
          onClick={handleSignUp}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
      </div>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
