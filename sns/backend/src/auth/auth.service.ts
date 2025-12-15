import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string | undefined): Promise<any> {
        if (!pass) return null;
        const user = await this.usersService.findOne(username);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // In a real app, generate JWT here. For this demo, just return user info.
        // If strict JWT required, we'd install @nestjs/jwt passport-jwt etc.
        // For simplicity as per prompt "record user info", returning user object is fine or simulate token.
        // Let's return the user object sans password.
        return user;
    }

    async signup(createUserDto: any) {
        const existingUser = await this.usersService.findOne(createUserDto.username);
        if (existingUser) {
            throw new UnauthorizedException('Username already taken');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userToCreate = { ...createUserDto, password: hashedPassword };
        // Default avatar if not provided (reusing frontend logic or similar)
        if (!userToCreate.avatarUrl) {
            userToCreate.avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${userToCreate.username}`;
        }

        const newUser = await this.usersService.create(userToCreate);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = (newUser as any)._doc || newUser;
        return result;
    }
}
