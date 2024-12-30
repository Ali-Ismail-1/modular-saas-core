"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabaseClient";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {
        const { error } = await signIn(email, password);
        if (error) {
            setMessage(`Login failed: ${error.message}`);
        } else {
            router.push("/"); // redirect to home
        }
    };

    const navigateToSignUp = () => {
        router.push("/auth/signup");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignIn();
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Log In</h1>
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
                        onClick={navigateToSignUp}
                        className="bg-blue-400 text-white px-4 py-2 rounded"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={handleSignIn}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        Log In
                    </button>

                </div>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}
