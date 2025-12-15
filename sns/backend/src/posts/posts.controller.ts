import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    try {
      return await this.postsService.create(createPostDto);
    } catch (error) {
      console.error("Create Post Error:", error);
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('user/:username')
  findByUser(@Param('username') username: string) {
    return this.postsService.findByUser(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Patch(':id/like')
  like(@Param('id') id: string, @Body('userId') userId: string) {
    return this.postsService.like(id, userId);
  }

  @Post(':id/comments')
  comment(@Param('id') id: string, @Body() commentData: { text: string; userId: string; username: string }) {
    return this.postsService.comment(id, commentData);
  }
}
