"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Post } from "@/lib/store";
import { PostCard } from "./PostCard";
import { faker } from "@faker-js/faker";

// Generate a single fake post
const generateFakePost = (index: number): Post => {
    faker.seed(index); // Consistent data for same index
    return {
        id: `fake-${index}`,
        userId: faker.string.uuid(),
        username: faker.internet.username(),
        userAvatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${index}`,
        imageUrls: [`https://picsum.photos/seed/${index}/800/800`],
        caption: faker.hacker.phrase() + " " + faker.word.words({ count: { min: 3, max: 10 } }),
        likes: Array.from({ length: faker.number.int({ min: 0, max: 500 }) }, () => faker.string.uuid()),
        comments: Array.from({ length: faker.number.int({ min: 0, max: 20 }) }, () => ({
            id: faker.string.uuid(),
            userId: faker.string.uuid(),
            username: faker.internet.username(),
            text: faker.hacker.phrase(),
            createdAt: faker.date.recent().toISOString(),
        })),
        createdAt: faker.date.recent({ days: 7 }).toISOString(),
    };
};

export function Feed() {
    const [realPosts, setRealPosts] = useState<Post[]>([]);
    const [fakePosts, setFakePosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreReal, setHasMoreReal] = useState(true);
    const fakePostIndex = useRef(0);

    // Fetch real posts from backend
    const fetchRealPosts = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:3001/posts');
            if (res.ok) {
                const data = await res.json();
                setRealPosts(data);
                if (data.length === 0) setHasMoreReal(false);
            }
        } catch (error) {
            console.error("Failed to fetch feed", error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchRealPosts();
    }, [fetchRealPosts]);

    // Load more fake posts
    const loadMoreFakePosts = useCallback(() => {
        if (isLoading) return;
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const newFakePosts: Post[] = [];
            for (let i = 0; i < 5; i++) {
                newFakePosts.push(generateFakePost(fakePostIndex.current));
                fakePostIndex.current++;
            }
            setFakePosts(prev => [...prev, ...newFakePosts]);
            setIsLoading(false);
        }, 500);
    }, [isLoading]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                loadMoreFakePosts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMoreFakePosts]);

    const allPosts = [...realPosts, ...fakePosts];

    return (
        <div className="flex flex-col gap-4 max-w-[470px] mx-auto py-8 px-4 sm:px-0">
            {allPosts.map((post: any, index) => (
                <PostCard key={post._id || post.id} post={post} priority={index < 2} />
            ))}

            {isLoading && (
                <div className="text-center py-4">
                    <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}

            {allPosts.length === 0 && !isLoading && (
                <div className="text-center py-20 text-gray-500">
                    <p>게시물이 없습니다.</p>
                </div>
            )}
        </div>
    );
}

