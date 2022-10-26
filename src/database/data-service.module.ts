import { Module } from '@nestjs/common';
import { DataServiceService } from './data-service.service';
import { PrismaModule } from './prisma/prisma.module';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [MongoModule],
  providers: [DataServiceService],
  exports: [DataServiceService],
})
export class DataServiceModule {}
