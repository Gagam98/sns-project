"use client";

import { useState } from "react";
import { store } from "@/lib/store";
import { X, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const [step, setStep] = useState<"select" | "details">("select");
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleNext = () => {
        if (imageUrl) {
            setStep("details");
        }
    };

    const handleShare = async () => {
        if (!user) return;
        if (!user.id) {
            alert("User ID not found. Please log in again.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    username: user.username,
                    userAvatar: user.avatarUrl,
                    imageUrls: [imageUrl],
                    caption,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            // Reset and close
            setStep("select");
            setImageUrl("");
            setCaption("");
            onClose();
            // Force reload or better way to update feed? For now window reload to be simple as requested in prompt "show in profile"
            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Upload file immediately (or ideally, preview then upload on submit, but upload first is easier to get URL)
            // Let's preview with blob first, but store file for upload later? 
            // Better: Upload now to get URL, simplifies submit logic.
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('http://localhost:3001/uploads', {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    const data = await res.json();
                    setImageUrl(data.url);
                    setStep("details");
                } else {
                    alert("Upload failed");
                }
            } catch (error) {
                console.error("Upload error", error);
                alert("Upload error");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
                <X className="w-8 h-8" />
            </button>

            <div className="w-full max-w-3xl bg-white rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[80vh]">

                <div className="w-full md:w-[60%] bg-black flex items-center justify-center min-h-[400px] relative aspect-square">
                    {imageUrl ? (
                        <div className="relative w-full h-full">
                            <Image src={imageUrl} alt="Preview" fill className="object-contain" />
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <ImageIcon className="w-20 h-20 text-white mx-auto mb-4 stroke-1" />
                            <p className="text-xl text-white font-light mb-6">사진과 동영상을 여기에 끌어다 놓으세요</p>
                            <label className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-2 rounded-md font-semibold text-sm cursor-pointer">
                                컴퓨터에서 선택
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <div className="mt-8">
                                <p className="text-gray-400 text-sm mb-2">또는 URL 입력</p>
                                <input
                                    type="text"
                                    placeholder="이미지 URL 붙여넣기"
                                    className="bg-gray-800 text-white p-2 rounded w-full text-sm"
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                                {imageUrl && <button onClick={handleNext} className="mt-2 text-blue-400 text-sm">확인</button>}
                            </div>
                        </div>
                    )}
                </div>

                {step === "details" && (
                    <div className="w-full md:w-[40%] flex flex-col bg-white border-l border-gray-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button onClick={() => setStep("select")} className="text-gray-500 font-semibold text-sm">이전</button>
                            <h2 className="font-semibold text-base">새 게시물 만들기</h2>
                            <button onClick={handleShare} disabled={isLoading} className="text-[#0095f6] font-semibold text-sm hover:text-[#00376b]">
                                {isLoading ? "공유 중..." : "공유하기"}
                            </button>
                        </div>

                        <div className="p-4 flex gap-3 items-center">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image src={user?.avatarUrl || "/default-avatar.png"} fill alt="me" />
                            </div>
                            <span className="font-semibold text-sm">{user?.username}</span>
                        </div>

                        <textarea
                            className="w-full p-4 outline-none resize-none flex-1 text-sm placeholder:text-gray-400"
                            placeholder="문구를 입력하세요..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={2200}
                        />

                        <div className="p-4 border-t border-gray-200 mt-auto">
                            <div className="flex justify-between items-center text-gray-500">
                                <span className="text-xs">이모티콘</span>
                                <span className="text-xs">{caption.length}/2,200</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
