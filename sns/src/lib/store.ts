
export interface User {
    _id?: string;      // MongoDB document ID
    id: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    fullName?: string;
    password?: string; // In a real app, this would be hashed.
    followers: string[];
    following: string[];
}

export interface Comment {
    _id?: string;      // MongoDB document ID
    id: string;
    userId: string;
    username: string; // denormalized for easier display
    text: string;
    createdAt: string;
}

export interface Post {
    id: string;
    userId: string;
    username: string; // denormalized
    userAvatar?: string; // denormalized
    imageUrls: string[];
    caption: string;
    likes: string[]; // userIds
    comments: Comment[];
    createdAt: string;
}

const STORAGE_KEY_USERS = "sns_users";
const STORAGE_KEY_POSTS = "sns_posts";
const STORAGE_KEY_CURRENT_USER = "sns_current_user_id";

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const store = {
    getUsers: (): User[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || "[]");
    },

    saveUsers: (users: User[]) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    },

    getPosts: (): Post[] => {
        if (typeof window === "undefined") return [];
        return JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || "[]");
    },

    savePosts: (posts: Post[]) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    },

    getCurrentUser: (): User | null => {
        if (typeof window === "undefined") return null;
        const userId = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        if (!userId) return null;
        return store.getUsers().find((u) => u.id === userId) || null;
    },

    login: async (username: string): Promise<User | null> => {
        await delay(500);
        const users = store.getUsers();
        const user = users.find((u) => u.username === username);
        if (user) {
            localStorage.setItem(STORAGE_KEY_CURRENT_USER, user.id);
            return user;
        }
        return null;
    },

    signup: async (username: string): Promise<User> => {
        await delay(500);
        const users = store.getUsers();
        if (users.find((u) => u.username === username)) {
            throw new Error("Username already taken");
        }
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            followers: [],
            following: [],
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`,
        };
        users.push(newUser);
        store.saveUsers(users);
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, newUser.id);
        return newUser;
    },

    logout: async () => {
        await delay(200);
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    },

    createPost: async (imageUrls: string[], caption: string): Promise<Post> => {
        await delay(500);
        const currentUser = store.getCurrentUser();
        if (!currentUser) throw new Error("Not logged in");

        const newPost: Post = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            username: currentUser.username,
            userAvatar: currentUser.avatarUrl,
            imageUrls,
            caption,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
        };

        const posts = store.getPosts();
        posts.unshift(newPost); // new posts first
        store.savePosts(posts);
        return newPost;
    },

    // Seed initial data if empty
    seed: () => {
        if (typeof window === "undefined") return;
        if (store.getUsers().length > 0) return;

        const demoUser: User = {
            id: "demo-user",
            username: "sungsimdang_official",
            bio: "성심당 공식 인스타그램\n1956년, 대전역 앞 작은 찐빵집이 대전의 문화가 되다.",
            avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SD",
            followers: ["a", "b", "c"],
            following: ["d"],
        };
        store.saveUsers([demoUser]);

        const demoPosts: Post[] = [
            {
                id: "post-1",
                userId: "demo-user",
                username: "sungsimdang_official",
                userAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=SD",
                imageUrls: ["https://picsum.photos/seed/cake/800/800"],
                caption: "딸기시루 판매시작! 🍓🍰 #성심당 #딸기시루",
                likes: ["user-2", "user-3"],
                comments: [],
                createdAt: new Date().toISOString()
            },
            {
                id: "post-2",
                userId: "demo-user",
                username: "sungsimdang_official",
                userAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=SD",
                imageUrls: ["https://picsum.photos/seed/bread/800/800"],
                caption: "갓 구운 튀김소보로 🍞",
                likes: ["user-1"],
                comments: [],
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        store.savePosts(demoPosts);
    },

    addComment: async (postId: string, text: string): Promise<Comment> => {
        await delay(500);
        const currentUser = store.getCurrentUser();
        if (!currentUser) throw new Error("Not logged in");

        const newComment: Comment = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            username: currentUser.username,
            text,
            createdAt: new Date().toISOString(),
        };

        const posts = store.getPosts();
        const postIndex = posts.findIndex((p) => p.id === postId);
        if (postIndex === -1) throw new Error("Post not found");

        posts[postIndex].comments.push(newComment);
        store.savePosts(posts);
        return newComment;
    }
};
