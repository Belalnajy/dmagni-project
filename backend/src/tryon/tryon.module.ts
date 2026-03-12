import { Module } from '@nestjs/common';
import { TryonService } from './tryon.service';
import { TryonController } from './tryon.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ReplicateModule } from '../replicate/replicate.module';

@Module({
  imports: [CloudinaryModule, ReplicateModule],
  providers: [TryonService],
  controllers: [TryonController],
})
export class TryonModule {}
