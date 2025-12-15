"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, store } from "@/lib/store";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password?: string) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const userId = localStorage.getItem("sns_current_user_id");
            if (userId && userId !== "undefined") {
                try {
                    const res = await fetch(`http://localhost:3001/users/id/${userId}`);
                    if (res.ok) {
                        const savedUser = await res.json();
                        // ensure id mapping
                        if (savedUser._id && !savedUser.id) savedUser.id = savedUser._id;
                        setUser(savedUser);
                    } else {
                        localStorage.removeItem("sns_current_user_id");
                    }
                } catch (error) {
                    console.error("Auth init failed", error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username: string, password?: string) => {
        try {
            const res = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Login failed');
            }
            const user = await res.json();
            // Map _id to id if necessary, or ensure backend sends id.
            // For now, let's assume we can use the user as is, but might need to normalizeid.
            if (user._id && !user.id) user.id = user._id;

            setUser(user);
            localStorage.setItem("sns_current_user_id", user.id);
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const signup = async (data: any) => {
        try {
            const res = await fetch('http://localhost:3001/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Signup failed');
            }
            const user = await res.json();
            if (user._id && !user.id) user.id = user._id;

            setUser(user);
            localStorage.setItem("sns_current_user_id", user.id);
        } catch (error: any) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = async () => {
        // await store.logout(); // client side only for now in original logic
        localStorage.removeItem("sns_current_user_id");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
