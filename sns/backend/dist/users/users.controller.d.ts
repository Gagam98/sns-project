import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(username: string): Promise<import("./schemas/user.schema").User>;
    findById(id: string): Promise<import("./schemas/user.schema").User>;
    update(username: string, updateUserDto: any): Promise<import("./schemas/user.schema").User | null>;
}
