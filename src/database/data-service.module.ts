import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataServiceService } from './data-service.service';
import { User, UserSchema } from '../core/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  providers: [DataServiceService],
  exports: [DataServiceService],
})
export class DataServiceModule {}
