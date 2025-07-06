import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageUploadWithDimensions {
  cloudinaryResult: CloudinaryUploadResult;
  calculatedDimensions: ImageDimensions;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly cloudName = 'dkkfv72vo';
  private readonly uploadPreset = 'teelab';

  constructor() {
  }

  /**
   * Calculates the dimensions of an image using HTML/JavaScript
   * @param file The image file
   * @returns Promise with the image dimensions
   */
  calculateImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };

        URL.revokeObjectURL(url);
        resolve(dimensions);
      };

      img.onerror = () => {
        console.error('❌ Error loading image for dimension calculation');
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for dimension calculation'));
      };

      img.src = url;
    });
  }

  /**
   * Uploads an image to Cloudinary with previously calculated dimensions
   * @param file The image file to upload
   * @returns Observable with the Cloudinary response and calculated dimensions
   */
  uploadImageWithDimensions(file: File): Observable<ImageUploadWithDimensions> {

    return from(
      this.calculateImageDimensions(file).then(async calculatedDimensions => {

        try {
          const cloudinaryResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            this.uploadImage(file).subscribe({
              next: (result) => resolve(result),
              error: (error) => reject(error)
            });
          });

          return {
            cloudinaryResult,
            calculatedDimensions
          };
        } catch (error) {
          console.error('❌ Error uploading image:', error);
          throw error;
        }
      })
    );
  }

  /**
   * Uploads an image to Cloudinary
   * @param file The image file to upload
   * @returns Observable with the Cloudinary response
   */
  uploadImage(file: File): Observable<CloudinaryUploadResult> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'design-lab');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return from(
      fetch(uploadUrl, {
        method: 'POST',
        body: formData
      }).then(async response => {
        const responseText = await response.text();

        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
            console.error('❌ Cloudinary error:', errorData);
          } catch {
            console.error('❌ Raw error response:', responseText);
          }
          throw new Error(`Cloudinary upload failed: ${responseText}`);
        }

        const result = JSON.parse(responseText);
        return result;
      })
    );
  }

  /**
   * Validates that the file is a valid image
   * @param file The file to validate
   * @returns true if it is a valid image, false otherwise
   */
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB máximo

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Gets information about supported file formats
   * @returns Array with supported MIME types
   */
  getSupportedFormats(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  }

  /**
   * Gets the maximum allowed file size in bytes
   * @returns The maximum file size in bytes
   */
  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }
}
