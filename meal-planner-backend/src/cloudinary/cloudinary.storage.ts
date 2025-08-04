import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipes',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  } as any,
});
