"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("./schemas/post.schema");
let PostsService = class PostsService {
    postModel;
    constructor(postModel) {
        this.postModel = postModel;
    }
    async create(createPostDto) {
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
    }
    async findAll() {
        return this.postModel.find().sort({ createdAt: -1 }).exec();
    }
    async findByUser(username) {
        return this.postModel.find({ username }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        return this.postModel.findById(id).exec();
    }
    async update(id, updatePostDto) {
        return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
    }
    async remove(id) {
        return this.postModel.findByIdAndDelete(id).exec();
    }
    async like(id, userId) {
        const post = await this.postModel.findById(id);
        if (!post)
            return null;
        const isLiked = post.likes.includes(userId);
        const update = isLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } };
        return this.postModel.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async comment(id, commentData) {
        return this.postModel.findByIdAndUpdate(id, {
            $push: {
                comments: {
                    ...commentData,
                    createdAt: new Date(),
                },
            },
        }, { new: true }).exec();
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PostsService);
//# sourceMappingURL=posts.service.js.map