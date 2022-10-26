import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/use-cases/user/entities/user.entity';
import { UserMongoRepository } from '../../use-cases/user/repo/user-mongo.repo';

@Injectable()
export class MongoService {
  constructor(public user: UserMongoRepository) {}
}
