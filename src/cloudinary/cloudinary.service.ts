import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    base64String: string,
    username: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const uploadOptions = {
        upload_preset: 'unsigned_upload',
        public_id: `${username}-avatar`,
        allowed_formats: [
          'png',
          'jpg',
          'jpeg',
          'gif',
          'svg',
          'ico',
          'jfif',
          'webp',
        ],
        transformation: [{ crop: 'fill' }],
      };

      cloudinary.uploader.upload(
        base64String,
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  removeFile(publicId: string) {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const deleteOptions = {
        invalidate: true,
      };
      cloudinary.uploader.destroy(publicId, deleteOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
