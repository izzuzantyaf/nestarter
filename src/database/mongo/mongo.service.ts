import { Injectable } from '@nestjs/common';
import { UserMongoRepository } from '../../use-cases/user/repo/user-mongo.repo';

@Injectable()
export class MongoService {
  constructor(public user: UserMongoRepository) {}
}
