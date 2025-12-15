import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto): Promise<import("./schemas/post.schema").Post>;
    findAll(): Promise<import("./schemas/post.schema").Post[]>;
    findByUser(username: string): Promise<import("./schemas/post.schema").Post[]>;
    findOne(id: string): Promise<import("./schemas/post.schema").Post | null>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<import("./schemas/post.schema").Post | null>;
    remove(id: string): Promise<import("./schemas/post.schema").Post | null>;
    like(id: string, userId: string): Promise<import("./schemas/post.schema").Post | null>;
    comment(id: string, commentData: {
        text: string;
        userId: string;
        username: string;
    }): Promise<import("./schemas/post.schema").Post | null>;
}
