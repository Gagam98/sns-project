"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./schemas/message.schema");
const conversation_schema_1 = require("./schemas/conversation.schema");
let ChatService = class ChatService {
    messageModel;
    conversationModel;
    constructor(messageModel, conversationModel) {
        this.messageModel = messageModel;
        this.conversationModel = conversationModel;
    }
    async findOrCreateConversation(userId1, userId2) {
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
    async getConversations(userId) {
        return this.conversationModel.find({
            participants: userId
        })
            .populate('participants', 'username email avatarUrl')
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .exec();
    }
    async getMessages(conversationId, limit = 50) {
        return this.messageModel.find({ conversationId })
            .populate('sender', 'username email avatarUrl')
            .populate('receiver', 'username email avatarUrl')
            .sort({ createdAt: 1 })
            .limit(limit)
            .exec();
    }
    async createMessage(senderId, receiverId, conversationId, content) {
        const message = new this.messageModel({
            sender: senderId,
            receiver: receiverId,
            conversationId,
            content,
        });
        const savedMessage = await message.save();
        await this.conversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: savedMessage._id,
        });
        return savedMessage.populate(['sender', 'receiver']);
    }
    async markAsRead(conversationId, userId) {
        await this.messageModel.updateMany({
            conversationId,
            receiver: userId,
            read: false
        }, { read: true });
    }
    async getUnreadCount(userId) {
        return this.messageModel.countDocuments({
            receiver: userId,
            read: false
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(1, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map