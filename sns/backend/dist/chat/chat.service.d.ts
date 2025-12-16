import { Model } from 'mongoose';
import { MessageDocument } from './schemas/message.schema';
import { ConversationDocument } from './schemas/conversation.schema';
export declare class ChatService {
    private messageModel;
    private conversationModel;
    constructor(messageModel: Model<MessageDocument>, conversationModel: Model<ConversationDocument>);
    findOrCreateConversation(userId1: string, userId2: string): Promise<ConversationDocument>;
    getConversations(userId: string): Promise<ConversationDocument[]>;
    getMessages(conversationId: string, limit?: number): Promise<MessageDocument[]>;
    createMessage(senderId: string, receiverId: string, conversationId: string, content: string): Promise<MessageDocument>;
    markAsRead(conversationId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
}
