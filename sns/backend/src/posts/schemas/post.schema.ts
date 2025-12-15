import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

// Embedded Comment Schema
export class Comment {
    @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
    _id: Types.ObjectId;

    @Prop({ required: true })
    text: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    username: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

@Schema({ timestamps: true })
export class Post { // Renamed from Board
    @Prop({ required: true })
    content: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: User[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ type: [Comment], default: [] })
    comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
