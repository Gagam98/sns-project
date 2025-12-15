import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: any, files: Array<Express.Multer.File>, req: any): Promise<import("./schemas/post.schema").Post>;
    findAll(): Promise<import("./schemas/post.schema").Post[]>;
    findByUser(username: string): Promise<import("./schemas/post.schema").Post[]>;
    findOne(id: string): Promise<import("./schemas/post.schema").Post | null>;
    toggleLike(id: string, req: any): Promise<import("./schemas/post.schema").Post | null>;
    addComment(id: string, body: {
        text: string;
        userId: string;
        username: string;
    }): Promise<import("./schemas/post.schema").Post | null>;
}
