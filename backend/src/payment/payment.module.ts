import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Subscription } from '../entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
