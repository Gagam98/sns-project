import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';
export declare class PostsService {
    private postModel;
    constructor(postModel: Model<Post>);
    create(createPostDto: CreatePostDto): Promise<Post>;
    findAll(): Promise<Post[]>;
    findByUser(username: string): Promise<Post[]>;
    findOne(id: string): Promise<Post | null>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null>;
    remove(id: string): Promise<Post | null>;
    like(id: string, userId: string): Promise<Post | null>;
    comment(id: string, commentData: {
        text: string;
        userId: string;
        username: string;
    }): Promise<Post | null>;
}
