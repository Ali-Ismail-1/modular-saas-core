"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/supabaseClient";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSignUp = async () => {
        const { error } = await signUp(email, password);
        if (error) {
            setMessage(`Sign up failed: ${error.message}`);
        } else {
            router.push("/auth/login");
        }
    };

    const navigateToLogin = () => {
        router.push("/auth/login");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignUp();
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mb-2 w-64"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 mb-4 w-64"
                    required
                />
                <div className="flex gap-4">
                    <button
                        onClick={navigateToLogin}
                        className="bg-blue-400 text-white px-4 py-2 rounded"
                    >
                        Log In
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        Sign Up
                    </button>
                </div>
            </form>

            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}