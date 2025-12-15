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
                            <button type="button" className="text-[#385185] text-sm font-semibold flex items-center justify-center gap-2 w-full">
                                Facebook으로 로그인
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
