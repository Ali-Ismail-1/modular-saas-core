"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setMessage(`Password reset failed: ${error.message}`);
        } else {
            setMessage("Password reset successful! You can now log in.");
            window.location.href = "/auth/login";
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Reset Your Password</h1>
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 mb-4 w-64"
            />
            <button
                onClick={handleResetPassword}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Set New Password
            </button>
            {message && <p className="mt-4 text-red-600">{message}</p>}
        </div>
    );
}
