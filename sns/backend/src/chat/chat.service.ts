import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
    ) { }

    // Find or create a conversation between two users
    async findOrCreateConversation(userId1: string, userId2: string): Promise<ConversationDocument> {
        const existingConversation = await this.conversationModel.findOne({
            participants: { $all: [userId1, userId2] }
        }).populate('participants', 'username email avatarUrl')
            .populate('lastMessage');

        if (existingConversation) {
            return existingConversation;
        }

        const newConversation = new this.conversationModel({
            participants: [userId1, userId2],
        });
        return newConversation.save();
    }

    // Get all conversations for a user
    async getConversations(userId: string): Promise<ConversationDocument[]> {
        return this.conversationModel.find({
            participants: userId
        })
            .populate('participants', 'username email avatarUrl')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .exec();
    }

    // Get messages for a conversation
    async getMessages(conversationId: string, limit: number = 50): Promise<MessageDocument[]> {
        return this.messageModel.find({ conversationId })
            .populate('sender', 'username email avatarUrl')
            .populate('receiver', 'username email avatarUrl')
            .sort({ createdAt: 1 })
            .limit(limit)
            .exec();
    }

    // Create a new message
    async createMessage(
        senderId: string,
        receiverId: string,
        conversationId: string,
        content: string
    ): Promise<MessageDocument> {
        const message = new this.messageModel({
            sender: senderId,
            receiver: receiverId,
            conversationId,
            content,
        });

        const savedMessage = await message.save();

        // Update conversation's lastMessage
        await this.conversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: savedMessage._id,
        });

        return savedMessage.populate(['sender', 'receiver']);
    }

    // Mark messages as read
    async markAsRead(conversationId: string, userId: string): Promise<void> {
        await this.messageModel.updateMany(
            {
                conversationId,
                receiver: userId,
                read: false
            },
            { read: true }
        );
    }

    // Get unread message count for a user
    async getUnreadCount(userId: string): Promise<number> {
        return this.messageModel.countDocuments({
            receiver: userId,
            read: false
        });
    }
}
