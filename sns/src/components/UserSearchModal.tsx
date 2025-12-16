"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, User as UserIcon, Search } from "lucide-react";

interface SearchUser {
    _id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
}

interface UserSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectUser: (user: SearchUser) => void;
    currentUserId: string;
}

const API_URL = "http://localhost:3001";

export function UserSearchModal({
    isOpen,
    onClose,
    onSelectUser,
    currentUserId,
}: UserSearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search users when query changes
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 1) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const users = await res.json();
                    // Filter out current user
                    setSearchResults(users.filter((u: SearchUser) => u._id !== currentUserId));
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentUserId]);

    const handleSelectUser = (user: SearchUser) => {
        onSelectUser(user);
        setSearchQuery("");
        setSearchResults([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="font-semibold text-base">새로운 메시지</h2>
                    <div className="w-8" /> {/* Spacer */}
                </div>

                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                    <span className="font-semibold text-sm">받는 사람:</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="검색..."
                        className="flex-1 outline-none text-sm"
                    />
                </div>

                {/* Search Results */}
                <div className="max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="py-2">
                            {searchResults.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {user.avatarUrl ? (
                                            <Image
                                                src={user.avatarUrl}
                                                alt={user.username}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{user.username}</p>
                                        {user.email && (
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : searchQuery.length > 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Search className="w-12 h-12 mb-4 opacity-30" />
                            <p className="text-sm">검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <p className="text-sm">사용자 이름을 검색하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
