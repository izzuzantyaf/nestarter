import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class DataServiceService extends MongoService {}
