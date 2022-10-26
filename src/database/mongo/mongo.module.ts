import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/use-cases/user/entities/user.entity';
import { UserMongoRepository } from 'src/use-cases/user/repo/user-mongo.repo';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [MongoService, UserMongoRepository],
  exports: [MongoService, UserMongoRepository],
})
export class MongoModule {}
