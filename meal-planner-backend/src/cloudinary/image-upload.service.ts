import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageUploadService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinaryClient: typeof cloudinary) {}

async uploadImageToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    this.cloudinaryClient.uploader.upload_stream(
      { folder: 'recipes' },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve(result);
      },
    ).end(file.buffer);
  });
}

}

