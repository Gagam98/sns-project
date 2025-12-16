"use client";

import Image from "next/image";
import { Conversation } from "@/lib/useSocket";
import { User as UserIcon } from "lucide-react";

interface ChatListProps {
    conversations: Conversation[];
    currentUserId: string;
    selectedConversationId: string | null;
    onSelectConversation: (conversation: Conversation) => void;
}

export function ChatList({
    conversations,
    currentUserId,
    selectedConversationId,
    onSelectConversation,
}: ChatListProps) {
    const getOtherParticipant = (conversation: Conversation) => {
        return conversation.participants.find(p => p._id !== currentUserId);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return '어제';
        } else if (days < 7) {
            return `${days}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }
    };

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1">내 메시지</h3>
                <p className="text-sm text-center">친구나 그룹에 비공개 사진과 메시지를 보내보세요.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                if (!otherUser) return null;

                const isSelected = selectedConversationId === conversation._id;

                return (
                    <button
                        key={conversation._id}
                        onClick={() => onSelectConversation(conversation)}
                        className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${isSelected ? 'bg-gray-100' : ''
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {otherUser.avatarUrl ? (
                                <Image
                                    src={otherUser.avatarUrl}
                                    alt={otherUser.username}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-7 h-7 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm truncate">
                                    {otherUser.username}
                                </span>
                                {conversation.lastMessage && (
                                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                        {formatTime(conversation.updatedAt)}
                                    </span>
                                )}
                            </div>
                            {conversation.lastMessage && (
                                <p className="text-sm text-gray-500 truncate">
                                    {conversation.lastMessage.content}
                                </p>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
