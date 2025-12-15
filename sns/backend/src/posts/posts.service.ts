import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUser(username: string): Promise<Post[]> {
    return this.postModel.find({ username }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async like(id: string, userId: string): Promise<Post | null> {
    const post = await this.postModel.findById(id);
    if (!post) return null;

    const isLiked = post.likes.includes(userId);
    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    return this.postModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async comment(id: string, commentData: { text: string; userId: string; username: string }): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            ...commentData,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    ).exec();
  }
}
