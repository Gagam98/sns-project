import { Controller, Get, Param, Query, Req, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    // Get all conversations for the logged-in user
    @UseGuards(AuthGuard('jwt'))
    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.chatService.getConversations(req.user.userId);
    }

    // Get or create a conversation with another user
    @UseGuards(AuthGuard('jwt'))
    @Post('conversations')
    async createConversation(
        @Req() req: any,
        @Body() body: { receiverId: string }
    ) {
        return this.chatService.findOrCreateConversation(req.user.userId, body.receiverId);
    }

    // Get messages for a specific conversation
    @UseGuards(AuthGuard('jwt'))
    @Get('conversations/:conversationId/messages')
    async getMessages(
        @Param('conversationId') conversationId: string,
        @Query('limit') limit?: string
    ) {
        const messageLimit = limit ? parseInt(limit, 10) : 50;
        return this.chatService.getMessages(conversationId, messageLimit);
    }

    // Mark messages as read
    @UseGuards(AuthGuard('jwt'))
    @Post('conversations/:conversationId/read')
    async markAsRead(
        @Param('conversationId') conversationId: string,
        @Req() req: any
    ) {
        await this.chatService.markAsRead(conversationId, req.user.userId);
        return { success: true };
    }

    // Get unread message count
    @UseGuards(AuthGuard('jwt'))
    @Get('unread-count')
    async getUnreadCount(@Req() req: any) {
        const count = await this.chatService.getUnreadCount(req.user.userId);
        return { count };
    }
}
