import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { TryonService } from './tryon.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tryon')
export class TryonController {
  constructor(private readonly tryonService: TryonService) {}

  @Post('upload-model')
  @UseInterceptors(FileInterceptor('file'))
  async uploadModel(@UploadedFile() file: Express.Multer.File) {
    return this.tryonService.uploadImage(file, 'model');
  }

  @Post('upload-garment')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGarment(@UploadedFile() file: Express.Multer.File) {
    return this.tryonService.uploadImage(file, 'garment');
  }

  @Post('merge')
  async mergeImages(@Body() body: { humanUrl: string; garmUrl: string }) {
    return this.tryonService.processTryOn(body.garmUrl, body.humanUrl);
  }
}
