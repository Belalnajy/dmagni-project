import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';
import { GenerationHistory } from '../entities/generation-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, GenerationHistory])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
