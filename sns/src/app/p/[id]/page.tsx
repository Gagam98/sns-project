"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Post, store, Comment } from "@/lib/store";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !user) return;

        try {
            const res = await fetch(`http://localhost:3001/posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: commentText,
                    userId: user.id,
                    username: user.username
                })
            });

            if (res.ok) {
                setCommentText("");
                // Refresh post data to show new comment
                const postRes = await fetch(`http://localhost:3001/posts/${id}`);
                if (postRes.ok) {
                    const updatedPost = await postRes.json();
                    setPost(updatedPost);
                }
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:3001/posts/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();

        // Polling if needed, but maybe less frequent
        const interval = setInterval(() => { if (id) fetchPost(); }, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !user || !post) return;

        try {
            await store.addComment(post.id, commentText);
            setCommentText("");
            // Refetch handled by polling or we could update local state optimistic
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    if (loading) return <div className="flex justify-center py-20">Loading...</div>;
    if (!post) return <div className="flex justify-center py-20">Post not found</div>;

    return (
        <div className="flex h-screen items-center justify-center bg-white md:bg-gray-100 p-0 md:p-8">
            <div className="flex w-full max-w-5xl h-full max-h-[90vh] bg-white border border-gray-200 rounded-sm overflow-hidden flex-col md:flex-row shadow-sm">

                {/* Left: Image */}
                <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative bg-gray-100">
                    <div className="relative w-full h-full min-h-[400px]">
                        <Image
                            src={(post as any).images?.[0] || post.imageUrls?.[0] || "/winter.jpg"}
                            alt="Post"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-[40%] flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100">
                                <Image src={(post as any).author?.avatarUrl || post.userAvatar || "/default-avatar.png"} fill alt={(post as any).author?.username || post.username || "User"} />
                            </div>
                            <Link href={`/profile/${(post as any).author?.username || post.username}`} className="font-semibold text-sm hover:underline">{(post as any).author?.username || post.username}</Link>
                        </div>
                        <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                    </div>

                    {/* Comments Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Creator Caption */}
                        <div className="flex gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={(post as any).author?.avatarUrl || post.userAvatar || "/default-avatar.png"} fill alt={(post as any).author?.username || post.username || "User"} />
                            </div>
                            <div>
                                <span className="font-semibold text-sm mr-2">{(post as any).author?.username || post.username}</span>
                                <span className="text-sm whitespace-pre-wrap">{(post as any).content || post.caption}</span>
                                <div className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Comments List */}
                        {(post.comments || []).map((comment, index) => (
                            <div key={comment._id || index} className="flex gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <Image src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.username}`} fill alt={comment.username} />
                                </div>
                                <div>
                                    <span className="font-semibold text-sm mr-2">{comment.username}</span>
                                    <span className="text-sm">{comment.text}</span>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <Heart className="w-6 h-6 stroke-2 hover:opacity-50 cursor-pointer" />
                                <MessageCircle className="w-6 h-6 stroke-2 hover:opacity-50 cursor-pointer -rotate-90" />
                                <Send className="w-6 h-6 stroke-2 hover:opacity-50 cursor-pointer" />
                            </div>
                            <Bookmark className="w-6 h-6 stroke-2 hover:opacity-50 cursor-pointer" />
                        </div>
                        <div className="font-semibold text-sm mb-1">좋아요 {post.likes.length}개</div>
                        <div className="text-xs text-gray-500 uppercase">{new Date(post.createdAt).toDateString()}</div>
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={user ? "댓글 달기..." : "로그인 후 댓글을 남겨보세요..."}
                            className="flex-1 outline-none text-sm"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            readOnly={!user}
                            onClick={() => !user && router.push("/login")}
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || !user}
                            className="text-[#0095f6] font-semibold text-sm disabled:opacity-50"
                        >
                            게시
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
