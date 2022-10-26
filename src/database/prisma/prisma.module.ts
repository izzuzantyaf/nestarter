import { Module } from '@nestjs/common';
import { PrismaClientService } from './prisma-client.service';
import { PrismaService } from './prisma.service';
import { UserRepository } from '../../use-cases/user/repo/user.repo';

@Module({
  providers: [PrismaClientService, PrismaService, UserRepository],
  exports: [UserRepository],
})
export class PrismaModule {}
