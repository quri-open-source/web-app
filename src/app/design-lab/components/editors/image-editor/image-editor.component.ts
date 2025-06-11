import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ImageProperties {
  imageUrl: string;
  width: number;
  height: number;
  scale: number;
  maintainAspectRatio: boolean;
}

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css'],
})
export class ImageEditorComponent {
  @Output() imageAdded = new EventEmitter<ImageProperties>();

  previewImageUrl: string = '';
  uploading: boolean = false;
  imageScale: number = 1;
  imageWidth: number = 200;
  imageHeight: number = 200;
  actualWidth: number = 0;
  actualHeight: number = 0;

  formatLabel(value: number): string {
    return `${value}x`;
  }

  // In a real app, you would handle file uploads to a server (like Cloudinary)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploading = true;
      const file = input.files[0];

      // Create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;

        // Get actual image dimensions
        const img = new Image();
        img.onload = () => {
          this.actualWidth = img.width;
          this.actualHeight = img.height;

          // Calculate appropriate dimensions while maintaining aspect ratio
          if (img.width > img.height) {
            // Landscape image
            this.imageWidth = Math.min(200, img.width);
            this.imageHeight = Math.floor((img.height / img.width) * this.imageWidth);
          } else {
            // Portrait or square image
            this.imageHeight = Math.min(200, img.height);
            this.imageWidth = Math.floor((img.width / img.height) * this.imageHeight);
          }
        };
        img.src = this.previewImageUrl;

        // Reset scale when new image is loaded
        this.imageScale = 1;

        // Simulate upload delay
        setTimeout(() => {
          this.uploading = false;
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  }
  removeImage(): void {
    this.previewImageUrl = '';
    this.imageScale = 1;
  }

  addImage(): void {
    if (this.previewImageUrl) {
      // In a real app, you would use the uploaded image URL from your server
      const imageProps: ImageProperties = {
        imageUrl: this.previewImageUrl,
        width: this.imageWidth,
        height: this.imageHeight,
        scale: this.imageScale,
        maintainAspectRatio: true,
      };
      this.imageAdded.emit(imageProps);

      // Clear the preview after adding to design
      this.previewImageUrl = '';
      this.imageScale = 1;
    }
  }
}