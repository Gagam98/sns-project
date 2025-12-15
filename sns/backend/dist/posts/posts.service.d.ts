import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
export declare class PostsService {
    private postModel;
    constructor(postModel: Model<PostDocument>);
    create(createPostDto: any, files: Array<Express.Multer.File>, authorId: string): Promise<Post>;
    findAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;
    findByAuthorUsername(username: string): Promise<Post[]>;
    toggleLike(postId: string, userId: string): Promise<Post | null>;
    addComment(postId: string, text: string, userId: string, username: string): Promise<Post | null>;
}
