import { Module } from '@nestjs/common';
import { ReplicateService } from './replicate.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ReplicateService],
  exports: [ReplicateService],
})
export class ReplicateModule {}
