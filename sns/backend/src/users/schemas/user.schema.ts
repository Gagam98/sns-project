import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false })
    password?: string; // Encrypted, optional for social login users

    @Prop()
    username: string;

    @Prop()
    avatarUrl: string;

    @Prop()
    googleId?: string; // Google OAuth user ID
}

export const UserSchema = SchemaFactory.createForClass(User);
