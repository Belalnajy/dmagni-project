import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';

@Injectable()
export class ReplicateService {
  private replicate: Replicate;

  constructor(private readonly configService: ConfigService) {
    this.replicate = new Replicate({
      auth: this.configService.get<string>('REPLICATE_API_TOKEN'),
    });
  }

  async performVirtualTryOn(garmUrl: string, humanUrl: string) {
    try {
      const output = await this.replicate.run(
        'yisol/idm-vton:c871bb9b046607b680449ecbae55fd8c972f0967389c9c381c828ca1ebfb696b',
        {
          input: {
            crop: false,
            seed: 42,
            steps: 30,
            category: 'upper_body',
            force_dc: false,
            garm_img: garmUrl,
            human_img: humanUrl,
            mask_only: false,
            garment_des: 't-shirt',
          },
        },
      );
      return output;
    } catch (error) {
      console.error('Replicate API Error:', error);
      throw new InternalServerErrorException(
        'Failed to process image with Replicate',
      );
    }
  }
}
