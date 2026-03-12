import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ReplicateService } from '../replicate/replicate.service';

@Injectable()
export class TryonService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly replicateService: ReplicateService,
  ) {}

  async uploadImage(file: Express.Multer.File, type: 'model' | 'garment') {
    const result = await this.cloudinaryService.uploadImage(
      file,
      `dmagni/${type}s`,
    );
    return { url: result.secure_url };
  }

  async processTryOn(garmUrl: string, humanUrl: string) {
    const output = await this.replicateService.performVirtualTryOn(
      garmUrl,
      humanUrl,
    );
    return { resultUrl: output };
  }
}
