import { User, UserDocument } from '../entities/user.entity';
import { Model } from 'mongoose';
import { isEmpty, isNotEmpty } from 'class-validator';
import { IUserRepo } from 'src/use-cases/user/interfaces/user-repo.interface';
import { CreateUserDto, UpdateUserDto } from 'src/use-cases/user/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';

export class UserMongoRepository implements IUserRepo {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seed(user: User) {
    const userCollection = await this.userModel.findOne().exec();
    if (isEmpty(userCollection)) {
      this.userModel.create(user);
      console.log('users collection seeded successfuly');
    }
  }

  async create(data: CreateUserDto): Promise<User> {
    return new User(await this.userModel.create(data));
  }

  async getAll(): Promise<User[]> {
    return (await this.userModel.find()).map((user) => new User(user));
  }

  async findById(id: string | number): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return isNotEmpty(user) ? new User(user) : null;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return isNotEmpty(user) ? new User(user) : null;
  }

  async update(data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(data.id, data, { new: true })
      .exec();
    return isNotEmpty(updatedUser) ? new User(updatedUser) : null;
  }

  async deleteById(id: string | number): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return isNotEmpty(deletedUser) ? new User(deletedUser) : null;
  }

  async deleteByEmail(email: string) {
    const deletedUser = await this.userModel
      .findOneAndDelete({ email: email })
      .exec();
    return isNotEmpty(deletedUser) ? new User(deletedUser) : null;
  }
}
