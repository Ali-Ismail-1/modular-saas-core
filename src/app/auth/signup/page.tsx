// src/app/auth/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, supabase } from "@/lib/supabaseClient";

interface Tenant {
    id: string;
    name: string;
    created_at: string;
}

interface User {
    id: string;
    email?: string; // Match Supabase type
    tenant_id?: string;
    role?: "admin" | "manager" | "user";
    created_at?: string;
}


export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tenantName, setTenantName] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSignUp = async () => {
        try {
            const user = await registerUser(email, password);
            const tenantId = await handleTenantLogic(tenantName, user.id);
            console.log("Tenant created or joined with ID:", tenantId);
            router.push("/auth/login");
        } catch (error: any) {
            setMessage(error.message || "Sign up failed");
        }
    };

    const handleTenantLogic = async (tenantName: string, userId: string): Promise<string> => {
        if (!tenantName) {
            throw new Error("Tenant name is required");
        }

        // Check if tenant exists
        const { data: tenant, error: tenantError } = await supabase
            .from("tenants")
            .select("*")
            .eq("name", tenantName)
            .single();

        if (tenantError) {
            if (tenantError.code === "PGRST116") {
                // Tenant does not exist, create a new one
                const { data: newTenant, error: createTenantError } = await supabase
                    .from("tenants")
                    .insert({ name: tenantName })
                    .select()
                    .single();

                if (createTenantError || !newTenant) {
                    throw new Error(`Failed to create tenant: ${createTenantError?.message}`);
                }
                await addUserToTenant(userId, newTenant.id, "admin");
                return newTenant.id;
            } else {
                throw new Error(`Failed to check tenant: ${tenantError.message}`);
            }
        }

        // Tenant exists, add user to it
        await addUserToTenant(userId, tenant.id, "user");
        return tenant.id;
    };

    const addUserToTenant = async (userId: string, tenantId: string, role: string) => {
        const { error } = await supabase
            .from("users")
            .insert({
                id: userId,
                tenant_id: tenantId,
                role,
                email,
            });

        if (error) {
            throw new Error(`Failed to add user to organization: ${error.message}`);
        }
    };

    const registerUser = async (email: string, password: string): Promise<User> => {
        const { data, error } = await signUp(email, password);
        if (error || !data?.user?.id || !data?.user?.email) {
            throw new Error(`Failed to sign up user: ${error?.message}`);
        }
        return {
            id: data.user.id,
            email: data.user.email,
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignUp();
    };

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
                <input
                    type="text"
                    placeholder="Organization Name (Optional)"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="border p-2 mb-2 w-64"
                    required
                />
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="bg-blue-400 text-white px-4 py-2 rounded"
                    >
                        Log In
                    </button>
                    <button
                        type="submit"
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
