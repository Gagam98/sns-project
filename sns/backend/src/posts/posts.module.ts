import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { memoryStorage } from 'multer'; // Add import
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const region = configService.get<string>('AWS_REGION');
                const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
                const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');
                const bucket = configService.get<string>('AWS_S3_BUCKET_NAME');

                if (!region || !accessKeyId || !secretAccessKey || !bucket) {
                    console.warn('AWS Credentials incomplete or missing. Falling back to memory storage. Image uploads to S3 will fail.');
                    return {
                        storage: memoryStorage(),
                    };
                }

                return {
                    storage: ((multerS3 as any).default || multerS3)({
                        s3: new S3Client({
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
            inject: [ConfigService],
        }),
    ],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule { }
