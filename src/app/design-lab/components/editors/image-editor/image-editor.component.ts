import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageLayer } from '../../../model/layer.entity';
import { LayerType } from '../../../../const';
import { CloudinaryService } from '../../../services/cloudinary.service';

export interface ImageProperties {
  imageUrl: string;
  width: number;
  height: number;
  scale: number;
  maintainAspectRatio: boolean;
}

// Configuration interface for image editor
export interface ImageEditorConfig {
  defaultPosition: { x: number; y: number };
  maxImageSize: { width: number; height: number };
  defaultZIndex: number;
  allowedFileTypes: string[];
  maxFileSize: number; // in bytes
}

@Component({
  selector: 'app-image-editor',
  standalone: true,  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css'],
})
export class ImageEditorComponent {
  @Input() config: ImageEditorConfig = {
    defaultPosition: { x: 100, y: 100 },
    maxImageSize: { width: 300, height: 300 },
    defaultZIndex: 1,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
  };

  @Input() existingImageLayers: ImageLayer[] = [];

  @Output() imageAdded = new EventEmitter<ImageProperties>();
  @Output() imageLayerCreated = new EventEmitter<ImageLayer>();

  previewImageUrl: string = '';
  uploading: boolean = false;
  imageScale: number = 1;
  imageWidth: number = 200;
  imageHeight: number = 200;
  actualWidth: number = 0;
  actualHeight: number = 0;
  uploadError: string | null = null;

  constructor(private snackBar: MatSnackBar, private cloudinaryService: CloudinaryService) {}

  formatLabel(value: number): string {
    return `${value}x`;
  }
  // Enhanced file selection with validation
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!this.config.allowedFileTypes.includes(file.type)) {
        this.showError('Invalid file type. Please select a valid image file.');
        this.resetFileInput(input);
        return;
      }

      // Validate file size
      if (file.size > this.config.maxFileSize) {
        const maxSizeMB = this.config.maxFileSize / (1024 * 1024);
        this.showError(`File size too large. Maximum allowed size is ${maxSizeMB}MB.`);
        this.resetFileInput(input);
        return;
      }

      this.uploading = true;
      this.uploadError = null;

      // Create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
        this.processImage();
      };
      
      reader.onerror = () => {
        this.showError('Failed to read the selected file.');
        this.uploading = false;
      };
      
      reader.readAsDataURL(file);
    }
  }

  private processImage(): void {
    // Get actual image dimensions
    const img = new Image();
    img.onload = () => {
      this.actualWidth = img.width;
      this.actualHeight = img.height;

      // Calculate appropriate dimensions while maintaining aspect ratio
      const maxWidth = this.config.maxImageSize.width;
      const maxHeight = this.config.maxImageSize.height;

      if (img.width > img.height) {
        // Landscape image
        this.imageWidth = Math.min(maxWidth, img.width);
        this.imageHeight = Math.floor((img.height / img.width) * this.imageWidth);
      } else {
        // Portrait or square image
        this.imageHeight = Math.min(maxHeight, img.height);
        this.imageWidth = Math.floor((img.width / img.height) * this.imageHeight);
      }

      // Reset scale when new image is loaded
      this.imageScale = 1;

      // Simulate upload delay (in real app, this would be actual upload to server)
      setTimeout(() => {
        this.uploading = false;
      }, 1500);
    };
    
    img.onerror = () => {
      this.showError('Failed to process the selected image.');
      this.uploading = false;
    };
    
    img.src = this.previewImageUrl;
  }

  private resetFileInput(input: HTMLInputElement): void {
    input.value = '';
  }

  private showError(message: string): void {
    this.uploadError = message;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }  removeImage(): void {
    this.previewImageUrl = '';
    this.imageScale = 1;
    this.uploadError = null;
  }

  addImage(): void {
    console.log('🎯 addImage() called');
    console.log('🔍 previewImageUrl:', this.previewImageUrl);
    console.log('📏 Current dimensions:', {
      width: this.imageWidth,
      height: this.imageHeight,
      scale: this.imageScale
    });

    if (this.previewImageUrl) {
      // Emit image properties for backward compatibility
      const imageProps: ImageProperties = {
        imageUrl: this.previewImageUrl,
        width: this.imageWidth,
        height: this.imageHeight,
        scale: this.imageScale,
        maintainAspectRatio: true,
      };

      console.log('📤 Emitting imageAdded event with props:', imageProps);
      this.imageAdded.emit(imageProps);

      // Create and emit a proper ImageLayer entity
      const imageLayer = this.createImageLayer(imageProps);
      console.log('📤 Emitting imageLayerCreated event with layer:', imageLayer);
      this.imageLayerCreated.emit(imageLayer);

      // Clear the preview after adding to design
      this.resetForm();
      console.log('✅ Image added to design and form reset');
    } else {
      console.warn('⚠️ No preview image URL available');
    }
  }

  private createImageLayer(imageProps: ImageProperties): ImageLayer {
    const id = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Calculate z-index based on existing layers
    const zIndex = this.existingImageLayers.length + this.config.defaultZIndex;

    return new ImageLayer(
      id,
      this.config.defaultPosition.x,
      this.config.defaultPosition.y,
      zIndex,
      1, // opacity
      true, // visible
      imageProps.imageUrl
    );
  }

  private resetForm(): void {
    this.previewImageUrl = '';
    this.imageScale = 1;
    this.uploadError = null;
    this.actualWidth = 0;
    this.actualHeight = 0;
    this.imageWidth = 200;
    this.imageHeight = 200;
  }

  // Validation methods
  isImageValid(): boolean {
    return this.previewImageUrl.length > 0 && !this.uploading;
  }

  getScaledDimensions(): { width: number; height: number } {
    return {
      width: Math.floor(this.imageWidth * this.imageScale),
      height: Math.floor(this.imageHeight * this.imageScale)
    };
  }

  getFileInfo(): string {
    if (!this.actualWidth || !this.actualHeight) return '';
    return `Original: ${this.actualWidth}x${this.actualHeight}px`;
  }

  /**
   * Opens Cloudinary upload widget and processes the uploaded image
   */
  openCloudinaryUpload(): void {
    this.uploading = true;
    this.uploadError = null;

    this.cloudinaryService.openUploadWidget()
      .then((imageUrl: string) => {
        this.previewImageUrl = imageUrl;
        this.processCloudinaryImage(imageUrl);
      })
      .catch((error) => {
        console.error('❌ Error uploading to Cloudinary:', error);
        this.showError('Failed to upload image to Cloudinary. Please try again.');
        this.uploading = false;
      });
  }

  /**
   * Process image uploaded to Cloudinary
   */
  private processCloudinaryImage(imageUrl: string): void {
    console.log('🖼️ Processing Cloudinary image:', imageUrl);
    this.previewImageUrl = imageUrl;

    const img = new Image();
    img.onload = () => {
      this.actualWidth = img.width;
      this.actualHeight = img.height;

      console.log('📏 Original image dimensions:', {
        width: img.width,
        height: img.height
      });

      // Calculate appropriate dimensions while maintaining aspect ratio
      const maxWidth = this.config.maxImageSize.width;
      const maxHeight = this.config.maxImageSize.height;

      if (img.width > img.height) {
        // Landscape image
        this.imageWidth = Math.min(maxWidth, img.width);
        this.imageHeight = Math.floor((img.height / img.width) * this.imageWidth);
      } else {
        // Portrait or square image
        this.imageHeight = Math.min(maxHeight, img.height);
        this.imageWidth = Math.floor((img.width / img.height) * this.imageHeight);
      }

      console.log('📐 Calculated display dimensions:', {
        width: this.imageWidth,
        height: this.imageHeight,
        scale: this.imageScale
      });

      // Reset scale when new image is loaded
      this.imageScale = 1;
      this.uploading = false;

      console.log('✅ Cloudinary image processed successfully');
    };
    
    img.onerror = () => {
      console.error('❌ Error loading Cloudinary image:', imageUrl);
      this.showError('Failed to load the uploaded image.');
      this.uploading = false;
    };
    
    img.src = imageUrl;
  }
}