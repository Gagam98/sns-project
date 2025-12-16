import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createData: any): Promise<User> {
        const createdUser = new this.userModel(createData);
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async searchByUsername(query: string): Promise<UserDocument[]> {
        if (!query || query.length < 1) {
            return [];
        }
        return this.userModel.find({
            username: { $regex: query, $options: 'i' }
        })
            .select('_id username email avatarUrl')
            .limit(20)
            .exec();
    }
}
