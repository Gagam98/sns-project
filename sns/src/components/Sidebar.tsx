"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Search, Compass, Film, MessageCircle, Heart, PlusSquare, Menu, LogOut, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreatePostModal } from "@/components/CreatePostModal";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);



    const links = [
        { name: "홈", href: "/", icon: Home },
        { name: "검색", href: "/search", icon: Search },
        { name: "탐색 탭", href: "/explore", icon: Compass },
        { name: "릴스", href: "/reels", icon: Film },
        { name: "메시지", href: "/messages", icon: MessageCircle },
        { name: "알림", href: "/notifications", icon: Heart },
    ];

    return (
        <>
            <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0 border-r border-gray-300 bg-white p-4 z-40">
                <Link href="/" className="mb-8 px-4 py-6">
                    <h1 className="text-2xl font-bold font-serif italic">Instagram</h1>
                </Link>

                <div className="flex-1 flex flex-col gap-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100",
                                    isActive && "font-bold"
                                )}
                            >
                                <Icon className={cn("w-6 h-6", isActive ? "stroke-[3px]" : "stroke-2")} />
                                <span className="text-base">{link.name}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => {
                            if (!user) {
                                alert("Login required");
                                return;
                            }
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100"
                    >
                        <PlusSquare className="w-6 h-6 stroke-2" />
                        <span className="text-base">만들기</span>
                    </button>

                    <Link
                        href={user && user.username ? `/profile/${user.username}` : "/login"}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100",
                            pathname?.startsWith("/profile") && "font-bold"
                        )}
                    >
                        {user?.avatarUrl ? (
                            <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
                            </div>
                        ) : (
                            <User className={cn("w-6 h-6", pathname?.startsWith("/profile") ? "stroke-[3px]" : "stroke-2")} />
                        )}
                        <span className="text-base">프로필</span>
                    </Link>
                </div>

                <div className="mt-auto">
                    {user ? (
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                        >
                            <LogOut className="w-6 h-6" />
                            <span className="text-base">로그아웃</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex w-full items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100 text-left"
                        >
                            <LogOut className="w-6 h-6" />
                            <span className="text-base">로그인</span>
                        </Link>
                    )}
                    <button className="flex w-full items-center gap-4 p-3 rounded-lg transition-colors hover:bg-gray-100 text-left">
                        <Menu className="w-6 h-6" />
                        <span className="text-base">더 보기</span>
                    </button>
                </div>
            </div>

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    );
}
