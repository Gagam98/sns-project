import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop()
    password?: string;

    @Prop()
    email?: string;

    @Prop()
    fullName?: string;

    @Prop()
    avatarUrl?: string;

    @Prop()
    bio?: string;

    @Prop({ type: [String], default: [] })
    followers: string[];

    @Prop({ type: [String], default: [] })
    following: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
