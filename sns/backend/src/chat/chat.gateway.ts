import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

interface ConnectedUser {
    odataId: string;
    socketId: string;
}

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, string> = new Map(); // odataId => socketId

    constructor(private chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        // Remove user from connected users
        for (const [odataId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) {
                this.connectedUsers.delete(odataId);
                break;
            }
        }
    }

    @SubscribeMessage('register')
    handleRegister(
        @MessageBody() data: { userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        this.connectedUsers.set(data.userId, client.id);
        console.log(`User ${data.userId} registered with socket ${client.id}`);
        return { success: true };
    }

    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(data.conversationId);
        console.log(`Client ${client.id} joined conversation ${data.conversationId}`);
        return { success: true };
    }

    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
        @MessageBody() data: { conversationId: string },
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(data.conversationId);
        return { success: true };
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: {
            senderId: string;
            receiverId: string;
            conversationId: string;
            content: string;
        },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const message = await this.chatService.createMessage(
                data.senderId,
                data.receiverId,
                data.conversationId,
                data.content,
            );

            // Emit to all users in the conversation room
            this.server.to(data.conversationId).emit('newMessage', message);

            // Also emit to the receiver directly if they're online but not in the room
            const receiverSocketId = this.connectedUsers.get(data.receiverId);
            if (receiverSocketId) {
                this.server.to(receiverSocketId).emit('messageNotification', {
                    conversationId: data.conversationId,
                    message,
                });
            }

            return { success: true, message };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, error: 'Failed to send message' };
        }
    }

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(
        @MessageBody() data: { conversationId: string; userId: string },
    ) {
        await this.chatService.markAsRead(data.conversationId, data.userId);
        return { success: true };
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean },
        @ConnectedSocket() client: Socket,
    ) {
        // Broadcast typing status to others in the conversation
        client.to(data.conversationId).emit('userTyping', {
            userId: data.userId,
            isTyping: data.isTyping,
        });
    }
}
