
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signup(userDto: any) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        return this.usersService.create({
            ...userDto,
            password: hashedPassword,
        });
    }

    async validateGoogleUser(profile: any): Promise<any> {
        const { emails, photos, displayName, id: googleId } = profile;
        const email = emails[0].value;
        const avatarUrl = photos?.[0]?.value;

        // Check if user exists
        let user = await this.usersService.findByEmail(email);

        if (!user) {
            // Create new user for Google OAuth - no password needed
            user = await this.usersService.create({
                email,
                username: displayName || email.split('@')[0],
                avatarUrl,
                googleId,
            });
        }

        const userDoc = user as any;
        const result = userDoc.toObject ? userDoc.toObject() : userDoc;
        delete result.password;
        return result;
    }
}
