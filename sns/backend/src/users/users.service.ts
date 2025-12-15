import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(createUserDto: any): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findOne(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async update(username: string, updateUserDto: any): Promise<User | null> {
        return this.userModel.findOneAndUpdate({ username }, updateUserDto, { new: true }).exec();
    }
}
