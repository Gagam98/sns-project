import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    username: string;

    @Prop()
    userAvatar?: string;

    @Prop({ type: [String], default: [] })
    imageUrls: string[];

    @Prop()
    caption?: string;

    @Prop({ type: [String], default: [] })
    likes: string[];

    @Prop({ type: [{ userId: String, username: String, text: String, createdAt: String }], default: [] })
    comments: Record<string, any>[];

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
