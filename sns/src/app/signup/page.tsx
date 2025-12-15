"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signup({ username, password, email, fullName });
            router.push("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message === "Username already taken" ? "이미 사용 중인 사용자 이름입니다." : err.message);
            } else {
                setError("가입 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm space-y-4">
                <div className="bg-white p-10 border border-gray-300 shadow-sm rounded-sm text-center">
                    <h1 className="text-4xl font-serif italic mb-4">Instagram</h1>
                    <p className="text-gray-500 font-semibold text-lg mb-6 leading-6 text-balance">
                        친구들의 사진과 동영상을 보려면 가입하세요.
                    </p>

                    <button
                        type="button"
                        className="flex w-full justify-center rounded-md bg-[#0095f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1877f2] font-sans mb-4"
                    >
                        Facebook으로 로그인
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-semibold">또는</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                className="relative block w-full rounded-sm border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 text-xs bg-gray-50"
                                placeholder="휴대폰 번호 또는 이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="relative block w-full rounded-sm border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 text-xs bg-gray-50"
                                placeholder="성명"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full rounded-sm border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 text-xs bg-gray-50"
                                placeholder="사용자 이름"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                className="relative block w-full rounded-sm border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-gray-400 text-xs bg-gray-50"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs">{error}</p>
                        )}

                        <div className="pt-2">
                            <p className="text-xs text-gray-500 mb-4">
                                저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에 업로드했을 수도 있습니다. <a href="#" className="font-semibold text-[#00376b]">더 알아보기</a>
                            </p>
                            <button
                                type="submit"
                                disabled={!username}
                                className="flex w-full justify-center rounded-md bg-[#0095f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1877f2] disabled:opacity-70 disabled:cursor-not-allowed font-sans"
                            >
                                가입
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-sm text-center">
                    <p className="text-sm">
                        계정이 있으신가요?{" "}
                        <Link href="/login" className="font-semibold text-[#0095f6]">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
