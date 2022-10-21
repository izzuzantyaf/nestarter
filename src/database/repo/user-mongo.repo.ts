import { User, UserDocument } from '../../core/entities/user.entity';
import { MongoGenericRepository } from './mongo-generic.repo';
import { Model } from 'mongoose';
import { isEmpty } from 'class-validator';

export class UserMongoRepository extends MongoGenericRepository<User> {
  constructor(repository: Model<UserDocument>) {
    super(repository);
  }

  async seed(user: User) {
    const userCollection = await this._repository.findOne().exec();
    if (isEmpty(userCollection)) {
      this._repository.create(user);
      console.log('users collection seeded successfuly');
    }
  }

  getByEmail(email: string) {
    return this._repository.findOne({ email: email }).exec();
  }

  deleteByEmail(email: string) {
    return this._repository.findOneAndDelete({ email: email }).exec();
  }
}
