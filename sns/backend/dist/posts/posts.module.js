"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const client_s3_1 = require("@aws-sdk/client-s3");
const multerS3 = __importStar(require("multer-s3"));
const multer_1 = require("multer");
const posts_service_1 = require("./posts.service");
const posts_controller_1 = require("./posts.controller");
const post_schema_1 = require("./schemas/post.schema");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            mongoose_1.MongooseModule.forFeature([{ name: post_schema_1.Post.name, schema: post_schema_1.PostSchema }]),
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const region = configService.get('AWS_REGION');
                    const accessKeyId = configService.get('AWS_ACCESS_KEY_ID');
                    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');
                    const bucket = configService.get('AWS_S3_BUCKET_NAME');
                    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
                        console.warn('AWS Credentials incomplete or missing. Falling back to memory storage. Image uploads to S3 will fail.');
                        return {
                            storage: (0, multer_1.memoryStorage)(),
                        };
                    }
                    return {
                        storage: (multerS3.default || multerS3)({
                            s3: new client_s3_1.S3Client({
                                region,
                                credentials: {
                                    accessKeyId,
                                    secretAccessKey,
                                },
                            }),
                            bucket,
                            key: (req, file, cb) => {
                                cb(null, `posts/${Date.now().toString()}-${file.originalname}`);
                            },
                        }),
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService],
        exports: [posts_service_1.PostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map