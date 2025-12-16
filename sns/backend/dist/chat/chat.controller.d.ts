import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getConversations(req: any): Promise<import("./schemas/conversation.schema").ConversationDocument[]>;
    createConversation(req: any, body: {
        receiverId: string;
    }): Promise<import("./schemas/conversation.schema").ConversationDocument>;
    getMessages(conversationId: string, limit?: string): Promise<import("./schemas/message.schema").MessageDocument[]>;
    markAsRead(conversationId: string, req: any): Promise<{
        success: boolean;
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
}
