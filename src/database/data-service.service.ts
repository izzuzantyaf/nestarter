import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../core/entities/user.entity';
import { UserMongoRepository } from './repo/user-mongo.repo';
import { userSeeder } from './seeds/user.seed';

@Injectable()
export class DataServiceService {
  users: UserMongoRepository;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.users = new UserMongoRepository(this.userModel);
    this.seedUser();
  }

  protected async seedUser() {
    const user = new User(userSeeder);
    await user.hashPassword();
    this.users.seed(user);
  }
}
