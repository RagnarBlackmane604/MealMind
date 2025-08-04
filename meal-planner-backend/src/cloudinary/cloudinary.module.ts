import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { ImageUploadService } from './image-upload.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  imports: [ConfigModule],
  controllers: [CloudinaryController], 
  providers: [CloudinaryProvider, ImageUploadService],
  exports: [ImageUploadService], 
})
export class CloudinaryModule {}
