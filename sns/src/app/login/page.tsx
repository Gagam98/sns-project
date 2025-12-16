"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            router.push("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message === "User not found" ? "존재하지 않는 사용자입니다." : err.message);
            } else {
                setError("로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-8">
                <div className="bg-white p-8 border border-gray-300 shadow-sm rounded-sm">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-4xl font-serif italic text-center">Instagram</h1>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full rounded-sm border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 sm:text-sm sm:leading-6 bg-gray-50"
                                placeholder="사용자 이름, 전화번호 또는 이메일"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="relative block w-full rounded-sm border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 sm:text-sm sm:leading-6 bg-gray-50"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={!username}
                                className="flex w-full justify-center rounded-md bg-[#0095f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1877f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed font-sans"
                            >
                                로그인
                            </button>
                        </div>

                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-semibold">또는</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => window.location.href = 'http://localhost:3001/auth/google'}
                                className="text-[#385185] text-sm font-semibold flex items-center justify-center gap-2 w-full"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        style={{ fill: "#4285F4" }}
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        style={{ fill: "#34A853" }}
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        style={{ fill: "#FBBC05" }}
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        style={{ fill: "#EA4335" }}
                                    />
                                </svg>
                                Google로 로그인
                            </button>
                        </div>
                        <div className="text-center mt-3">
                            <button type="button" className="text-xs text-[#00376b]">
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>

                    </form>
                </div>

                <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-sm text-center">
                    <p className="text-sm">
                        계정이 없으신가요?{" "}
                        <Link href="/signup" className="font-semibold text-[#0095f6]">
                            가입하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
