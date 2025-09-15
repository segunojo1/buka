"use client";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // This will automatically rehydrate the user state from cookies
    useAuth();
    return <>{children}</>;
}