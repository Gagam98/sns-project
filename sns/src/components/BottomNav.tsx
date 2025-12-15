"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Search, PlusSquare, Film, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreatePostModal } from "@/components/CreatePostModal";

export function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50 px-4">
                <Link
                    href="/"
                    className={cn("text-black", pathname === "/" && "font-bold")}
                >
                    <Home className={cn("w-6 h-6", pathname === "/" ? "stroke-[3px]" : "stroke-2")} />
                </Link>

                <Link
                    href="/search"
                    className={cn("text-black", pathname === "/search" && "font-bold")}
                >
                    <Search className={cn("w-6 h-6", pathname === "/search" ? "stroke-[3px]" : "stroke-2")} />
                </Link>

                <button
                    onClick={() => {
                        if (!user) {
                            alert("Login required");
                            return;
                        }
                        setIsCreateModalOpen(true);
                    }}
                    className="text-black"
                >
                    <PlusSquare className="w-6 h-6 stroke-2" />
                </button>

                <Link
                    href={`/reels`}
                    className={cn("text-black", pathname === "/reels" && "font-bold")}
                >
                    <Film className={cn("w-6 h-6", pathname === "/reels" ? "stroke-[3px]" : "stroke-2")} />
                </Link>

                <Link
                    href={user ? `/profile/${user.username}` : "/login"}
                    className={cn("text-black", pathname?.startsWith("/profile") && "font-bold")}
                >
                    {user?.avatarUrl ? (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
                        </div>
                    ) : (
                        <User className={cn("w-6 h-6", pathname?.startsWith("/profile") ? "stroke-[3px]" : "stroke-2")} />
                    )}
                </Link>
            </div>

            <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    );
}
