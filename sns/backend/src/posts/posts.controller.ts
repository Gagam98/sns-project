import { Controller, Get, Post as HttpPost, Patch, Delete, Body, Param, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(AuthGuard('jwt'))
    @HttpPost()
    @UseInterceptors(FilesInterceptor('images', 10))
    create(@Body() createPostDto: any, @UploadedFiles() files: Array<Express.Multer.File>, @Req() req: any) {
        return this.postsService.create(createPostDto, files, req.user.userId);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get('user/:username')
    findByUser(@Param('username') username: string) {
        return this.postsService.findByAuthorUsername(username);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        return this.postsService.delete(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/like')
    toggleLike(@Param('id') id: string, @Req() req: any) {
        return this.postsService.toggleLike(id, req.user.userId);
    }

    @HttpPost(':id/comments')
    addComment(@Param('id') id: string, @Body() body: { text: string; userId: string; username: string }) {
        return this.postsService.addComment(id, body.text, body.userId, body.username);
    }
}

