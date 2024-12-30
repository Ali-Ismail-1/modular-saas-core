"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:3000/auth/reset-password",
        });
        if (error) {
            setMessage(`Reset password failed: ${error.message}`);
        } else {
            setMessage("Password reset email sent. Please check your inbox.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-4 w-64"
            />
            <button
                onClick={handleResetPassword}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Reset Password
            </button>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}
