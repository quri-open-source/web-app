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
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add Image</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="image-editor-container">
          <h4 class="section-title">Upload Image</h4>
          @if (!previewImageUrl) {
            <div class="upload-section">
              <div class="upload-placeholder" (click)="fileInput.click()">
                <mat-icon>cloud_upload</mat-icon>
                <p>Click to upload an image</p>
                <input
                  type="file"
                  hidden
                  #fileInput
                  (change)="onFileSelected($event)"
                  accept="image/*"
                />
              </div>
              <p class="file-hint">Supported formats: JPG, PNG, GIF</p>
            </div>
          } @else {
            <div class="preview-section">
              <h4 class="section-title">Preview &amp; Settings</h4>
              <div class="image-preview">
                <img [src]="previewImageUrl" alt="Preview" />
              </div>

              <div class="image-controls">
                <h5>Scale</h5>
                <mat-slider
                  min="0.5"
                  max="2"
                  step="0.1"
                  discrete
                  [displayWith]="formatLabel"
                  class="scale-slider"
                >
                  <input matSliderThumb [(ngModel)]="imageScale" />
                </mat-slider>
                <span class="scale-value">{{ imageScale }}x</span>
              </div>

              <div class="image-options">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="removeImage()"
                  matTooltip="Remove Image"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
          @if (uploading) {
            <div class="upload-progress">
              <p>Uploading...</p>
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </div>
          }

          <button
            mat-raised-button
            color="primary"
            [disabled]="!previewImageUrl || uploading"
            (click)="addImage()"
          >
            Add to Design
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .image-editor-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .upload-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
      }

      .upload-placeholder {
        width: 100%;
        height: 160px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: border-color 0.3s, background-color 0.3s;
        margin-bottom: 12px;
      }

      .upload-placeholder:hover {
        border-color: #3f51b5;
        background-color: rgba(63, 81, 181, 0.05);
      }

      .upload-placeholder mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: #757575;
      }

      .upload-placeholder p {
        margin-top: 8px;
        color: #757575;
      }

      .file-hint {
        margin-top: 8px;
        color: #757575;
        font-size: 0.85rem;
      }
      .preview-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-bottom: 16px;
      }

      .image-preview {
        max-width: 100%;
        max-height: 200px;
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid #eee;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
      }

      .image-preview img {
        max-width: 100%;
        max-height: 180px;
        object-fit: contain;
      }

      .image-controls {
        width: 100%;
        padding: 8px 0;
      }

      .image-controls h5 {
        margin: 8px 0;
        font-size: 0.9rem;
        color: #555;
      }

      .scale-slider {
        width: 100%;
        margin-bottom: 8px;
      }

      .scale-value {
        display: inline-block;
        margin-left: 8px;
        font-size: 0.9rem;
        color: #555;
      }

      .image-options {
        display: flex;
        justify-content: center;
        gap: 8px;
      }

      .upload-progress {
        margin: 8px 0;
      }

      .section-title {
        margin-top: 12px;
        margin-bottom: 16px;
        color: #333;
        font-weight: 500;
        font-size: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
      }
    `,
  ],
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