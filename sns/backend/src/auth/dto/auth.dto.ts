export class LoginDto {
    username: string;
    password?: string;
}

export class SignupDto {
    username: string;
    password?: string;
    email?: string;
    fullName?: string;
}
