"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export interface Message {
    _id: string;
    sender: {
        _id: string;
        username: string;
        avatarUrl?: string;
    };
    receiver: {
        _id: string;
        username: string;
        avatarUrl?: string;
    };
    content: string;
    conversationId: string;
    read: boolean;
    createdAt: string;
}

export interface Conversation {
    _id: string;
    participants: Array<{
        _id: string;
        username: string;
        avatarUrl?: string;
    }>;
    lastMessage?: Message;
    updatedAt: string;
}

export function useSocket(userId: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!userId) return;

        // Create socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            // Register user with socket server
            socket.emit('register', { userId });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socket.on('newMessage', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('messageNotification', (data: { conversationId: string; message: Message }) => {
            // Handle notification for messages received while not in the conversation
            console.log('New message notification:', data);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    const joinConversation = useCallback((conversationId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('joinConversation', { conversationId });
        }
    }, []);

    const leaveConversation = useCallback((conversationId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('leaveConversation', { conversationId });
        }
    }, []);

    const sendMessage = useCallback((data: {
        senderId: string;
        receiverId: string;
        conversationId: string;
        content: string;
    }) => {
        if (socketRef.current) {
            socketRef.current.emit('sendMessage', data);
        }
    }, []);

    const markAsRead = useCallback((conversationId: string, userId: string) => {
        if (socketRef.current) {
            socketRef.current.emit('markAsRead', { conversationId, userId });
        }
    }, []);

    const sendTyping = useCallback((conversationId: string, userId: string, isTyping: boolean) => {
        if (socketRef.current) {
            socketRef.current.emit('typing', { conversationId, userId, isTyping });
        }
    }, []);

    const setInitialMessages = useCallback((initialMessages: Message[]) => {
        setMessages(initialMessages);
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        messages,
        setInitialMessages,
        joinConversation,
        leaveConversation,
        sendMessage,
        markAsRead,
        sendTyping,
    };
}
