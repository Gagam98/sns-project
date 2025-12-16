"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Message, Conversation } from "@/lib/useSocket";
import { User as UserIcon, Send, Smile, Image as ImageIcon, Heart } from "lucide-react";

interface ChatRoomProps {
    conversation: Conversation;
    currentUserId: string;
    messages: Message[];
    onSendMessage: (content: string) => void;
    onTyping?: (isTyping: boolean) => void;
}

export function ChatRoom({
    conversation,
    currentUserId,
    messages,
    onSendMessage,
    onTyping,
}: ChatRoomProps) {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const otherUser = conversation.participants.find(p => p._id !== currentUserId);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onTyping?.(e.target.value.length > 0);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return '오늘';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return '어제';
        } else {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        }
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
        const messageDate = new Date(message.createdAt).toDateString();
        if (messageDate !== currentDate) {
            currentDate = messageDate;
            groupedMessages.push({ date: message.createdAt, messages: [message] });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(message);
        }
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {otherUser?.avatarUrl ? (
                        <Image
                            src={otherUser.avatarUrl}
                            alt={otherUser.username}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="font-semibold text-sm">{otherUser?.username}</h2>
                    <p className="text-xs text-gray-500">Active now</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* User info at top */}
                <div className="flex flex-col items-center py-8">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                        {otherUser?.avatarUrl ? (
                            <Image
                                src={otherUser.avatarUrl}
                                alt={otherUser.username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <h3 className="font-semibold text-lg">{otherUser?.username}</h3>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <button className="mt-4 px-4 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        프로필 보기
                    </button>
                </div>

                {/* Messages grouped by date */}
                {groupedMessages.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {/* Date separator */}
                        <div className="flex justify-center my-4">
                            <span className="text-xs text-gray-500 px-3 py-1">
                                {formatDate(group.date)}
                            </span>
                        </div>

                        {/* Messages */}
                        {group.messages.map((message, msgIndex) => {
                            const isOwn = message.sender._id === currentUserId;
                            const showAvatar = !isOwn && (
                                msgIndex === 0 ||
                                group.messages[msgIndex - 1].sender._id !== message.sender._id
                            );

                            return (
                                <div
                                    key={message._id}
                                    className={`flex items-end gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Avatar for other user */}
                                    {!isOwn && (
                                        <div className="w-7 h-7 flex-shrink-0">
                                            {showAvatar && (
                                                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200">
                                                    {message.sender.avatarUrl ? (
                                                        <Image
                                                            src={message.sender.avatarUrl}
                                                            alt={message.sender.username}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Time for own messages (left side) */}
                                    {isOwn && msgIndex === group.messages.length - 1 && (
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                                            {formatTime(message.createdAt)}
                                        </span>
                                    )}

                                    {/* Message bubble */}
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-3xl ${isOwn
                                            ? 'bg-blue-500 text-white rounded-br-md'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </div>

                                    {/* Time for other's messages (right side) */}
                                    {!isOwn && msgIndex === group.messages.length - 1 && (
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                                            {formatTime(message.createdAt)}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
                        <button type="button" className="p-1 hover:opacity-70 transition-opacity">
                            <Smile className="w-6 h-6 text-gray-600" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="메시지 입력..."
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                        {inputValue.trim() ? (
                            <button
                                type="submit"
                                className="text-blue-500 font-semibold text-sm hover:opacity-70 transition-opacity"
                            >
                                보내기
                            </button>
                        ) : (
                            <>
                                <button type="button" className="p-1 hover:opacity-70 transition-opacity">
                                    <ImageIcon className="w-6 h-6 text-gray-600" />
                                </button>
                                <button type="button" className="p-1 hover:opacity-70 transition-opacity">
                                    <Heart className="w-6 h-6 text-gray-600" />
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
