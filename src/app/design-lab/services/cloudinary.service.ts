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
  private readonly cloudName = 'dkkfv72vo'; // Tu cloud name de Cloudinary
  private readonly uploadPreset = 'teelab'; // CAMBIAR: Usa el nombre de tu preset unsigned

  constructor() {
  }

  /**
   * Calcula las dimensiones de una imagen usando HTML/JavaScript
   * @param file El archivo de imagen
   * @returns Promise con las dimensiones de la imagen
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

        URL.revokeObjectURL(url); // Liberar memoria
        resolve(dimensions);
      };

      img.onerror = () => {
        console.error('❌ Error loading image for dimension calculation');
        URL.revokeObjectURL(url); // Liberar memoria
        reject(new Error('Failed to load image for dimension calculation'));
      };

      img.src = url;
    });
  }

  /**
   * Sube una imagen a Cloudinary con dimensiones calculadas previamente
   * @param file El archivo de imagen a subir
   * @returns Observable con la respuesta de Cloudinary y las dimensiones calculadas
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
   * Sube una imagen a Cloudinary
   * @param file El archivo de imagen a subir
   * @returns Observable con la respuesta de Cloudinary
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
   * Valida que el archivo sea una imagen válida
   * @param file El archivo a validar
   * @returns true si es una imagen válida, false en caso contrario
   */
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB máximo

    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Obtiene información sobre los formatos de archivo soportados
   * @returns Array con los tipos MIME soportados
   */
  getSupportedFormats(): string[] {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  }

  /**
   * Obtiene el tamaño máximo de archivo permitido en bytes
   * @returns El tamaño máximo en bytes
   */
  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10MB
  }
}
