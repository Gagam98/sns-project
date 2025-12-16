
import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user); // returns access_token
    }

    @Post('signup')
    async signup(@Body() req: any) {
        return this.authService.signup(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Req() req: any) {
        return req.user;
    }
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {
        // Initiates the Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const { access_token } = await this.authService.login(req.user);
        res.redirect(`http://localhost:3000/auth/callback?token=${access_token}`);
    }
}
