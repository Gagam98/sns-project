"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User, Post, store } from "@/lib/store";
import { Grid, Bookmark, Users, ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import { EditProfileModal } from "@/components/EditProfileModal";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        // Decode username because it might be URL encoded
        const decodedUsername = decodeURIComponent(username);

        if (decodedUsername === "undefined") {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch User
                const userRes = await fetch(`http://localhost:3001/users/${decodedUsername}`);
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setProfileUser(userData);
                } else {
                    setProfileUser(null);
                }

                // Fetch Posts
                const postsRes = await fetch(`http://localhost:3001/posts/user/${decodedUsername}`);
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    setPosts(postsData);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    // Handle specific "user not found" or "undefined" case more gracefully
    if (!profileUser) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <h2 className="text-2xl font-semibold">죄송합니다. 페이지를 사용할 수 없습니다.</h2>
            <p className="text-gray-500">클릭하신 링크가 잘못되었거나 페이지가 삭제되었습니다.</p>
            <Link href="/" className="bg-[#0095f6] text-white px-4 py-2 rounded-md font-semibold text-sm">홈으로 돌아가기</Link>
        </div>
    );

    return (
        <div className="max-w-[935px] mx-auto py-8 px-5 lg:px-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row mb-12 items-center md:items-start md:gap-24">
                {/* Avatar Section */}
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex justify-center w-full md:w-auto">
                    <div className="relative w-[77px] h-[77px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-200 group cursor-pointer">
                        <Image
                            src={profileUser.avatarUrl || "/default-avatar.png"}
                            alt={profileUser.username}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col gap-5 flex-1 w-full">
                    {/* Row 1: Username & Buttons */}
                    <div className="flex items-center gap-4 flex-wrap mb-2 md:mb-0">
                        <h2 className="text-xl md:text-[20px] font-normal">{profileUser.username}</h2>
                        <div className="flex gap-2">
                            {currentUser?.id === profileUser.id ? (
                                <>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="bg-[#efefef] hover:bg-[#dbdbdb] px-4 py-[7px] rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        프로필 편집
                                    </button>
                                    <button className="bg-[#efefef] hover:bg-[#dbdbdb] px-4 py-[7px] rounded-lg font-semibold text-sm transition-colors">
                                        보관된 스토리 보기
                                    </button>
                                    <EditProfileModal
                                        isOpen={isEditModalOpen}
                                        onClose={() => setIsEditModalOpen(false)}
                                        user={profileUser}
                                        onUpdate={() => window.location.reload()}
                                    />
                                </>
                            ) : (
                                <>
                                    <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-[7px] rounded-lg font-semibold text-sm transition-colors">
                                        팔로우
                                    </button>
                                    <button className="bg-[#efefef] hover:bg-[#dbdbdb] px-4 py-[7px] rounded-lg font-semibold text-sm transition-colors">
                                        메시지 보내기
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Stats (Desktop order) */}
                    <div className="flex gap-10 text-base mb-2 md:mb-0 order-3 md:order-2 justify-around md:justify-start border-t border-gray-100 md:border-0 py-4 md:py-0 w-full md:w-auto">
                        <span>게시물 <span className="font-semibold">{posts.length}</span></span>
                        <span>팔로워 <span className="font-semibold">{profileUser.followers.length}</span></span>
                        <span>팔로우 <span className="font-semibold">{profileUser.following.length}</span></span>
                    </div>

                    {/* Row 3: Bio (Desktop order) */}
                    <div className="text-sm order-2 md:order-3 mb-4 md:mb-0 px-1 md:px-0">
                        <p className="font-semibold">{profileUser.fullName || profileUser.username}</p>
                        <p className="whitespace-pre-wrap mt-1 leading-5">{profileUser.bio}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 mb-0 flex justify-center gap-14">
                <button className="flex items-center gap-1.5 py-4 border-t border-black -mt-[1px] text-xs font-semibold tracking-widest uppercase text-black">
                    <Grid className="w-3 h-3" /> <span className="pt-[1px]">게시물</span>
                </button>
                <button className="flex items-center gap-1.5 py-4 text-gray-400 text-xs font-semibold tracking-widest uppercase">
                    <Bookmark className="w-3 h-3" /> <span className="pt-[1px]">저장됨</span>
                </button>
                <button className="flex items-center gap-1.5 py-4 text-gray-400 text-xs font-semibold tracking-widest uppercase">
                    <Users className="w-3 h-3" /> <span className="pt-[1px]">태그됨</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-1 md:gap-[4px]">
                {posts.map((post: any) => (
                    <Link key={post._id || post.id} href={`/p/${post._id || post.id}`} className="relative aspect-square cursor-pointer group bg-gray-100 block">
                        <Image
                            src={post.imageUrls[0]}
                            alt="User post"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white gap-6 font-bold z-10 transition-opacity">
                            <div className="flex items-center gap-1.5">
                                <Heart className="w-5 h-5 fill-white" /> {post.likes.length}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MessageCircle className="w-5 h-5 fill-white" /> {post.comments.length}
                            </div>
                        </div>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-[62px] h-[62px] border-2 border-black rounded-full flex items-center justify-center mb-4">
                            <Grid className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-extrabold mb-4">게시물 없음</h1>
                    </div>
                )}
            </div>
        </div>
    );
}


