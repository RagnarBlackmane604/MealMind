import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const uploadedImage = await this.imageUploadService.uploadImageToCloudinary(
      file,
    );

    return {
      message: 'Upload successful',
      url: uploadedImage.secure_url,
    };
  }
}