export class CreatePostDto {
    userId: string;
    username: string;
    userAvatar?: string;
    imageUrls: string[];
    caption?: string;
}
