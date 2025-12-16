import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    server: Server;
    private connectedUsers;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleRegister(data: {
        userId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleJoinConversation(data: {
        conversationId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleLeaveConversation(data: {
        conversationId: string;
    }, client: Socket): {
        success: boolean;
    };
    handleSendMessage(data: {
        senderId: string;
        receiverId: string;
        conversationId: string;
        content: string;
    }, client: Socket): Promise<{
        success: boolean;
        message: import("./schemas/message.schema").MessageDocument;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
    handleMarkAsRead(data: {
        conversationId: string;
        userId: string;
    }): Promise<{
        success: boolean;
    }>;
    handleTyping(data: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
    }, client: Socket): void;
}
