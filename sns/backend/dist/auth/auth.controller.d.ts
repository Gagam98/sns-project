import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<any>;
    signup(signupDto: SignupDto): Promise<any>;
}
