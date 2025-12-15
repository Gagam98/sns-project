import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    validateUser(username: string, pass: string | undefined): Promise<any>;
    login(user: any): Promise<any>;
    signup(createUserDto: any): Promise<any>;
}
