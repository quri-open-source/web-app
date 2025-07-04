import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly cloudName = 'dpprgycup';
  private readonly uploadPreset = 'Teelab';

  /**
   * Opens Cloudinary upload widget and returns a promise with the uploaded image URL
   */
  openUploadWidget(): Promise<string> {
    return new Promise((resolve, reject) => {
      // @ts-ignore - Cloudinary widget is loaded from CDN
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: this.cloudName,
          uploadPreset: this.uploadPreset,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          cropping: false,
          folder: 'teelab_uploads',
          maxFileSize: 5 * 1024 * 1024, // 5MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          resourceType: 'image',
          showAdvancedOptions: false,
          showUploadMoreButton: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else if (result && result.event === 'success') {
            console.log('✅ Image uploaded to Cloudinary:', result.info.secure_url);
            resolve(result.info.secure_url);
          }
        }
      );
      
      widget.open();
    });
  }
}
