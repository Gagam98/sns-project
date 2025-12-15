"use client";

import { useState } from "react";
import { X, Camera } from "lucide-react";
import Image from "next/image";
import { User } from "@/lib/store";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdate: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
    const [bio, setBio] = useState(user.bio || "");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/users/${user.username}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl, bio }),
            });

            if (res.ok) {
                onUpdate();
                onClose();
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
                <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-md bg-white rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">프로필 편집</h2>
                    <button onClick={handleSubmit} disabled={isLoading} className="text-[#0095f6] font-semibold text-sm hover:text-[#00376b]">
                        {isLoading ? "저장 중..." : "완료"}
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                            <Image src={avatarUrl || "/default-avatar.png"} fill alt="avatar" className="object-cover" />
                        </div>
                        <label className="text-[#0095f6] font-semibold text-sm cursor-pointer hover:text-[#00376b]">
                            사진 변경
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        try {
                                            const res = await fetch('http://localhost:3001/uploads', {
                                                method: 'POST',
                                                body: formData,
                                            });
                                            if (res.ok) {
                                                const data = await res.json();
                                                setAvatarUrl(data.url);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Upload failed");
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm">소개</label>
                        <textarea
                            className="border p-2 rounded w-full resize-none h-24 text-sm"
                            placeholder="소개를 입력하세요 (선택 사항)"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={150}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
