import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../use-cases/user/repo/user.repo';

@Injectable()
export class PrismaService {
  constructor(public user: UserRepository) {}
}
