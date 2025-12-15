import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // Connect to MongoDB. Using hardcoded URL for now as per previous context or env
        // Previous context used local, but we might want to use ENV.
        // Assuming .env exists in backend root.
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/sns'),
        UsersModule,
        PostsModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
