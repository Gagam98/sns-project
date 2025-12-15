"use client";

import { useEffect, useState } from "react";
import { Post, store } from "@/lib/store";
import { PostCard } from "./PostCard";

export function Feed() {
    const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const POSTS_PER_PAGE = 5;

    useEffect(() => {
        // Initial load and polling
        const fetchPosts = async () => {
            try {
                const res = await fetch('http://localhost:3001/posts');
                if (res.ok) {
                    const data = await res.json();
                    setDisplayPosts(data.slice(0, page * POSTS_PER_PAGE)); // Apply slicing here
                }
            } catch (error) {
                console.error("Failed to fetch feed", error);
            }
        };

        fetchPosts();

        // Polling for updates (checking length only for simplicity to avoid heavy diff)
        const interval = setInterval(fetchPosts, 2000); // Poll the API
        return () => clearInterval(interval);
    }, [page]); // Dependency on page to re-fetch and slice correctly

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col gap-4 max-w-[470px] mx-auto py-8 px-4 sm:px-0">
            {displayPosts.map((post: any, index) => (
                <PostCard key={post._id || post.id} post={post} priority={index < 2} />
            ))}

            {displayPosts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>게시물이 없습니다.</p>
                </div>
            )}
        </div>
    );
}
