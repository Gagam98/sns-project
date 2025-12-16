import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    searchUsers(query: string): Promise<import("./schemas/user.schema").UserDocument[]>;
    findById(id: string): Promise<import("./schemas/user.schema").UserDocument | null>;
    findByUsername(username: string): Promise<import("./schemas/user.schema").UserDocument | null>;
}
