
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get("token");
            if (token) {
                localStorage.setItem("sns_token", token);

                // Fetch user info and save user ID for session persistence
                try {
                    const userRes = await fetch('http://localhost:3001/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (userRes.ok) {
                        const user = await userRes.json();
                        const userId = user._id || user.id;
                        if (userId) {
                            localStorage.setItem("sns_current_user_id", userId);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                }

                // Redirect to home
                window.location.href = "/";
            } else {
                router.push("/login");
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
}
