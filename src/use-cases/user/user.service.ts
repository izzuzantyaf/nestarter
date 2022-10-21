import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { isEmpty, isNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/core/dtos/create-user.dto';
import { ErrorResponse } from 'src/core/dtos/response.dto';
import { DataServiceService } from 'src/database/data-service.service';
import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserService {
  constructor(
    private dataService: DataServiceService,
    private userFactoryService: UserFactoryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log('Incoming data :', createUserDto);
    const newUser = this.userFactoryService.create(createUserDto);
    const errors = newUser.validateProps();
    if (isNotEmpty(errors))
      throw new BadRequestException(
        new ErrorResponse('Data tidak valid', { errors }),
      );
    const user = await this.dataService.users.getByEmail(newUser.email);
    console.log('Existing user :', user);
    if (isNotEmpty(user))
      throw new ConflictException(new ErrorResponse('Email sudah terdaftar'));
    await newUser.hashPassword();
    const storedUser = await this.dataService.users.create(newUser);
    console.log('Stored user :', storedUser);
    return this.userFactoryService.create(storedUser);
  }

  async getAll() {
    const users = this.userFactoryService.createMany(
      await this.dataService.users.getAll(),
    );
    return users;
  }

  async delete(id: string) {
    console.log('User id :', id);
    const deletedUser = await this.dataService.users.deleteById(id);
    console.log('Deleted user :', deletedUser);
    if (isEmpty(deletedUser))
      throw new BadRequestException(new ErrorResponse('Akun gagal dihapus'));
    return this.userFactoryService.create(deletedUser);
  }

  async validateUser(email: string, password: string) {
    console.log('Incoming credentials :', { email, password });
    const userFromDb = await this.dataService.users.getByEmail(email);
    console.log('User from database :', userFromDb);
    if (isEmpty(userFromDb))
      throw new BadRequestException(new ErrorResponse('Login gagal'));
    const user = this.userFactoryService.create(userFromDb);
    const isPasswordMatch = await user.verifyPassword(password);
    console.log('Is password match :', isPasswordMatch);
    if (!isPasswordMatch)
      throw new BadRequestException(new ErrorResponse('Login gagal'));
    return user;
  }
}
