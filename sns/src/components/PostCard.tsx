"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/lib/store";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface PostCardProps {
    post: Post;
    priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

    // Backend (NestJS) returns 'author' object, while Mock returned flattened 'username'/'userAvatar'
    const postAuthor = (post as any).author;
    const authorName = post.username || postAuthor?.username || "Unknown";
    const authorAvatar = post.userAvatar || postAuthor?.avatarUrl || "/winter.jpg";

    useEffect(() => {
        if (user && post.likes?.includes(user.id)) {
            setIsLiked(true);
        }
    }, [user, post.likes]);

    const handleLike = async () => {
        if (!user) return alert("Please login to like");

        // Optimistic update
        const prevLiked = isLiked;
        setIsLiked(!prevLiked);
        setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);

        try {
            const token = localStorage.getItem('sns_token');
            const res = await fetch(`http://localhost:3001/posts/${(post as any)._id || post.id}/like`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id })
            });
            if (!res.ok) {
                // Revert if failed
                setIsLiked(prevLiked);
                setLikesCount(prev => prevLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error("Like failed", error);
            // Revert
            setIsLiked(prevLiked);
            setLikesCount(prev => prevLiked ? prev + 1 : prev - 1);
        }
    };

    // Handle both old (imageUrls) and new (images) field names
    const imageUrl = (post as any).images?.[0] || post.imageUrls?.[0] || "/winter.jpg";
    const [imgSrc, setImgSrc] = useState(imageUrl);

    // Update src when prop changes
    useEffect(() => {
        const newImageUrl = (post as any).images?.[0] || post.imageUrls?.[0] || "/winter.jpg";
        setImgSrc(newImageUrl);
    }, [post]);

    return (
        <article className="border-b border-gray-200 pb-4 mb-4 last:border-0">
            {/* Header */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                            src={authorAvatar}
                            alt={authorName} // Fixed missing alt
                            fill
                            className="object-cover"
                            onError={(e) => {
                                e.currentTarget.srcset = "/winter.jpg";
                            }}
                        />
                    </div>
                    <span className="font-semibold text-sm">{authorName}</span>
                    <span className="text-gray-500 text-xs">• {formatTimeAgo(post.createdAt)}</span>
                </div>
                <button>
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square w-full rounded-sm overflow-hidden border border-gray-100 bg-gray-100">
                <Image
                    src={imgSrc}
                    alt="Post content"
                    fill
                    className="object-cover"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 468px"
                    onError={() => {
                        // Fallback to a placeholder or hide if broken
                        setImgSrc("/winter.jpg"); // Ideally use a generic placeholder
                    }}
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
                        <Heart className={`w-6 h-6 stroke-[2px] ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <MessageCircle className="w-6 h-6 stroke-[2px] -rotate-90" />
                    </button>
                    <button className="hover:opacity-70 transition-opacity">
                        <Send className="w-6 h-6 stroke-[2px]" />
                    </button>
                </div>
                <button className="hover:opacity-70 transition-opacity">
                    <Bookmark className="w-6 h-6 stroke-[2px]" />
                </button>
            </div>

            {/* Likes */}
            <div className="font-semibold text-sm mb-2">
                좋아요 {likesCount}개
            </div>

            {/* Caption/Content */}
            <div className="text-sm">
                <span className="font-semibold mr-2">{authorName}</span>
                <span className="whitespace-pre-wrap">{(post as any).content || post.caption}</span>
            </div>

            {/* Comments Count */}
            {(post.comments?.length || 0) > 0 && (
                <Link href={`/p/${(post as any)._id || post.id}`} className="text-gray-500 text-sm mt-1 block">
                    댓글 {post.comments?.length || 0}개 모두 보기
                </Link>
            )}

            {/* Input Comment */}
            <div className="flex items-center gap-2 mt-2">
                <Link href={`/p/${(post as any)._id || post.id}`} className="w-full">
                    <input
                        type="text"
                        placeholder="댓글 달기..."
                        className="text-sm w-full py-1 outline-none placeholder:text-gray-500 cursor-pointer"
                        readOnly
                    />
                </Link>
            </div>
        </article>
    );
}

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일`;
    return `${Math.floor(diffInDays / 7)}주`;
}
