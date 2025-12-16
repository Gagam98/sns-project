"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket, Conversation, Message } from "@/lib/useSocket";
import { ChatList } from "@/components/ChatList";
import { ChatRoom } from "@/components/ChatRoom";
import { Sidebar } from "@/components/Sidebar";
import { UserSearchModal } from "@/components/UserSearchModal";
import { Edit, ChevronDown } from "lucide-react";

const API_URL = "http://localhost:3001";

interface SearchUser {
    _id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
}

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const {
        isConnected,
        messages,
        setInitialMessages,
        joinConversation,
        leaveConversation,
        sendMessage,
        markAsRead,
        sendTyping,
    } = useSocket(user?.id || user?._id || null);

    // Fetch conversations
    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("sns_token");
                const res = await fetch(`${API_URL}/chat/conversations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };

        fetchConversations();
    }, [user]);

    // Fetch messages when conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("sns_token");
                const res = await fetch(
                    `${API_URL}/chat/conversations/${selectedConversation._id}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setInitialMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
        joinConversation(selectedConversation._id);

        return () => {
            leaveConversation(selectedConversation._id);
        };
    }, [selectedConversation, joinConversation, leaveConversation, setInitialMessages]);

    const handleSelectConversation = (conversation: Conversation) => {
        if (selectedConversation) {
            leaveConversation(selectedConversation._id);
        }
        setSelectedConversation(conversation);
    };

    const handleSelectUser = async (selectedUser: SearchUser) => {
        if (!user) return;

        try {
            const token = localStorage.getItem("sns_token");
            const res = await fetch(`${API_URL}/chat/conversations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ receiverId: selectedUser._id }),
            });

            if (res.ok) {
                const conversation = await res.json();

                // Add to conversations list if not already there
                setConversations((prev) => {
                    const exists = prev.some((c) => c._id === conversation._id);
                    if (exists) {
                        return prev;
                    }
                    return [conversation, ...prev];
                });

                // Select the conversation
                setSelectedConversation(conversation);
            }
        } catch (error) {
            console.error("Failed to create conversation:", error);
        }
    };

    const handleSendMessage = (content: string) => {
        if (!selectedConversation || !user) return;

        const currentUserId = user.id || user._id;
        const otherUser = selectedConversation.participants.find(
            (p) => p._id !== currentUserId
        );

        if (!otherUser) return;

        sendMessage({
            senderId: currentUserId,
            receiverId: otherUser._id,
            conversationId: selectedConversation._id,
            content,
        });
    };

    const handleTyping = (isTyping: boolean) => {
        if (!selectedConversation || !user) return;
        sendTyping(selectedConversation._id, user.id || user._id, isTyping);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
                    <a href="/login" className="text-blue-500 hover:underline">
                        로그인하기
                    </a>
                </div>
            </div>
        );
    }

    const currentUserId = user.id || user._id;

    return (
        <div className="flex h-full bg-white">
            {/* Conversations List */}
            <div className="w-[400px] min-w-[320px] border-r border-gray-200 flex flex-col bg-white h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-lg">{user.username}</h1>
                        <ChevronDown className="w-5 h-5" />
                    </div>
                    <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="새 메시지"
                    >
                        <Edit className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages/Requests tabs */}
                <div className="flex border-b border-gray-200">
                    <button className="flex-1 py-3 text-sm font-semibold border-b-2 border-black">
                        메시지
                    </button>
                    <button className="flex-1 py-3 text-sm font-semibold text-gray-400">
                        요청
                    </button>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    <ChatList
                        conversations={conversations}
                        currentUserId={currentUserId}
                        selectedConversationId={selectedConversation?._id || null}
                        onSelectConversation={handleSelectConversation}
                    />
                </div>
            </div>

            {/* Chat Room */}
            <div className="flex-1 flex flex-col h-full">
                {selectedConversation ? (
                    <ChatRoom
                        conversation={selectedConversation}
                        currentUserId={currentUserId}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onTyping={handleTyping}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-24 h-24 rounded-full border-2 border-gray-900 flex items-center justify-center mb-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-1">내 메시지</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            친구나 그룹에 비공개 사진과 메시지를 보내보세요.
                        </p>
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                        >
                            메시지 보내기
                        </button>
                    </div>
                )}
            </div>

            {/* User Search Modal */}
            <UserSearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onSelectUser={handleSelectUser}
                currentUserId={currentUserId}
            />
        </div>
    );
}
