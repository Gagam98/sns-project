import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

    async create(createPostDto: any, files: Array<Express.Multer.File>, authorId: string): Promise<Post> {
        const images = files ? files.map(file => (file as any).location) : [];
        const createdPost = new this.postModel({
            ...createPostDto,
            author: authorId,
            images,
        });
        return createdPost.save();
    }

    async findAll(): Promise<Post[]> {
        return this.postModel.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username email avatarUrl')
            .exec();
    }

    async findById(id: string): Promise<Post | null> {
        return this.postModel.findById(id).populate('author', 'username email avatarUrl').exec();
    }

    async findByAuthorUsername(username: string): Promise<Post[]> {
        return this.postModel.find()
            .populate('author', 'username email avatarUrl')
            .then(posts => posts.filter((post: any) => post.author?.username === username));
    }

    async toggleLike(postId: string, userId: string): Promise<Post | null> {
        const post = await this.postModel.findById(postId);
        if (!post) return null;

        const isLiked = post.likes.some((id: any) => id.toString() === userId.toString());

        if (isLiked) {
            // Unlike
            return this.postModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: userId } },
                { new: true }
            );
        } else {
            // Like
            return this.postModel.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: userId } },
                { new: true }
            );
        }
    }

    async addComment(postId: string, text: string, userId: string, username: string): Promise<Post | null> {
        const comment = {
            text,
            userId,
            username,
            createdAt: new Date(),
        };

        return this.postModel.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate('author', 'username email avatarUrl').exec();
    }
}
