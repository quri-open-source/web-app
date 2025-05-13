import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project.entity';
import { Layer, TextContent, ImageContent } from '../../model/layer.entity';
import { EditorContainerComponent } from '../editors/editor-container/editor-container.component';
import { TextProperties } from '../editors/text-editor/text-editor.component';
import { ImageProperties } from '../editors/image-editor/image-editor.component';

interface GarmentColor {
  label: string;
  value: string;
}

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    EditorContainerComponent,
  ],
  template: `
    <div class="project-edit-container">
      <!-- Toolbar -->
      <mat-toolbar color="primary" class="edit-toolbar">
        <button mat-icon-button (click)="goBack()" matTooltip="Back to Project">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="toolbar-spacer"></span>
        <span *ngIf="project">Editing: {{ project.name }}</span>
        <span class="toolbar-spacer"></span>
        <button mat-raised-button color="accent" (click)="saveProject()">
          <mat-icon>save</mat-icon>
          Save
        </button>
      </mat-toolbar>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading project...</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="error-container">
        <p>{{ error }}</p>
        <button mat-button color="primary" (click)="loadProject()">
          Retry
        </button>
      </div>
      <!-- Editor Content -->
      <div *ngIf="!loading && !error && project" class="editor-content">
        <div class="editor-layout">
          <!-- Preview Panel -->
          <div class="preview-panel">
            <h3>Preview</h3>
            <div class="tshirt-preview">
              <div class="tshirt-container">
                <div class="tshirt-image">
                  <div
                    class="cropped-image"
                    [style.background-image]="'url(' + garmentColorImages + ')'"
                    [style.background-position]="
                      getBackgroundPosition(project.garmentColor)
                    "
                  >
                    <!-- Text Layers -->
                    <div
                      *ngFor="let layer of textLayers"
                      class="text-layer"
                      [style.color]="getTextContent(layer).color"
                      [style.font-family]="getTextContent(layer).fontFamily"
                      [style.font-size.px]="getTextContent(layer).fontSize"
                      [style.font-weight]="getTextContent(layer).fontWeight"
                      [style.font-style]="
                        getTextContent(layer).italic ? 'italic' : 'normal'
                      "
                      [style.text-decoration]="
                        getTextContent(layer).underline ? 'underline' : 'none'
                      "
                      [style.text-align]="getTextContent(layer).textAlign"
                      [style.left.px]="layer.content.x"
                      [style.top.px]="layer.content.y"
                      [style.background-color]="
                        getTextContent(layer).color === '#ffffff'
                          ? 'rgba(0,0,0,0.1)'
                          : 'transparent'
                      "
                      (mousedown)="startDrag($event, layer)"
                    >
                      <div
                        class="delete-button"
                        (mousedown)="$event.stopPropagation()"
                        (click)="deleteLayer($event, layer, 'text')"
                      >
                        ×
                      </div>
                      {{ getTextContent(layer).text }}
                    </div>
                    <!-- Image Layers -->
                    <div
                      *ngFor="let layer of imageLayers"
                      class="image-layer"
                      [style.left.px]="layer.content.x"
                      [style.top.px]="layer.content.y"
                      (mousedown)="startDrag($event, layer)"
                    >
                      <div
                        class="delete-button"
                        (mousedown)="$event.stopPropagation()"
                        (click)="deleteLayer($event, layer, 'image')"
                      >
                        ×
                      </div>
                      <img
                        [src]="getImageContent(layer).imageUrl"
                        [style.width.px]="
                          getImageContent(layer).width *
                          getImageContent(layer).scale
                        "
                        [style.height.px]="
                          getImageContent(layer).height *
                          getImageContent(layer).scale
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tools Panel -->
          <div class="tools-panel">
            <app-editor-container
              [currentColor]="project.garmentColor"
              (colorSelected)="selectColor($event)"
              (textAdded)="handleTextAdded($event)"
              (imageAdded)="handleImageAdded($event)"
            >
            </app-editor-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .project-edit-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .edit-toolbar {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .loading-container,
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        text-align: center;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin: 24px;
      }

      .loading-container p,
      .error-container p {
        margin: 16px 0;
        color: #666;
      }

      .editor-content {
        flex: 1;
        padding: 16px;
        overflow: auto;
      }
      .editor-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
        padding: 16px;
      }

      @media (max-width: 768px) {
        .editor-layout {
          grid-template-columns: 1fr;
        }
      }

      .preview-panel {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .tshirt-preview {
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
        border-radius: 4px;
        overflow: hidden;
        padding: 20px;
      }
      .tshirt-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      .tshirt-image {
        width: 320px;
        height: 320px;
        border-radius: 8px;
        position: relative;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .cropped-image {
        width: 100%;
        height: 100%;
        background-size: 400% 400%; /* 4x4 grid */
        background-repeat: no-repeat;
        transition: background-position 0.3s ease;
        filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
        position: relative; /* This allows absolute positioning of child elements */
      }
      .text-layer {
        position: absolute;
        display: inline-block;
        width: auto;
        height: auto;
        padding: 6px 8px;
        cursor: move;
        user-select: none;
        transition: transform 0.2s ease;
        transform-origin: center;
        /* Text shadow to help with visibility against different backgrounds */
        text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.5);
        position: relative;
        white-space: nowrap;
        border-radius: 4px;
      }

      .text-layer .delete-button,
      .image-layer .delete-button {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 24px;
        height: 24px;
        background-color: #f44336;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: bold;
      }

      .text-layer:hover .delete-button,
      .image-layer:hover .delete-button {
        opacity: 1;
      }
      .image-layer {
        position: absolute;
        cursor: move;
        user-select: none;
        transition: transform 0.2s ease;
        position: relative;
        display: inline-block;
        padding: 2px;
        border-radius: 4px;
      }

      .image-layer img {
        max-width: 100%;
        height: auto;
        pointer-events: none; /* Prevents image from being draggable by default */
      }

      .tools-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .color-swatch {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s, border-color 0.2s;
      }

      .color-swatch:hover {
        transform: scale(1.1);
      }

      .color-swatch.selected {
        border-color: #3f51b5;
        transform: scale(1.1);
      }

      .size-selector {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .mt-16 {
        margin-top: 16px;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #333;
      }
    `,
  ],
  providers: [ProjectService],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  loading = true;
  error: string | null = null;
  projectId: string = '';
  textLayers: Layer[] = [];
  imageLayers: Layer[] = [];

  // For dragging functionality
  private draggedLayer: Layer | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private boundMouseMove: any;
  private boundMouseUp: any;

  // Garment colors configuration
  garmentColors: GarmentColor[] = [
    { label: 'black', value: '#161615' }, // row 0, col 0
    { label: 'gray', value: '#403D3B' }, // row 0, col 1
    { label: 'light-gray', value: '#B3B1AF' }, // row 0, col 2
    { label: 'white', value: '#EDEDED' }, // row 0, col 3
    { label: 'red', value: '#B51B14' }, // row 1, col 0
    { label: 'pink', value: '#F459B0' }, // row 1, col 1
    { label: 'light-purple', value: '#D890E4' }, // row 1, col 2
    { label: 'purple', value: '#693FA0' }, // row 1, col 3
    { label: 'light-blue', value: '#00A5BC' }, // row 2, col 0
    { label: 'cyan', value: '#31B7C9' }, // row 2, col 1
    { label: 'sky-blue', value: '#3F9BDC' }, // row 2, col 2
    { label: 'blue', value: '#1B3D92' }, // row 2, col 3
    { label: 'green', value: '#1B8937' }, // row 3, col 0
    { label: 'light-green', value: '#5BBE65' }, // row 3, col 1
    { label: 'yellow', value: '#FECD08' }, // row 3, col 2
    { label: 'dark-yellow', value: '#F2AB00' }, // row 3, col 3
  ];

  garmentColorImages =
    'https://res.cloudinary.com/dkkfv72vo/image/upload/v1747000549/Frame_530_hfhrko.webp';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
    });

    // Bind the methods once to ensure we use the same reference when adding and removing
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);

    // Add mouse event listeners for dragging
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  // Clean up event listeners when component is destroyed
  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }

  loadProject(): void {
    if (!this.projectId) {
      this.error = 'No project ID provided';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching project:', err);
        this.error =
          'Failed to load project. Please check if the project ID is valid.';
        this.loading = false;
      },
    });
  }

  selectColor(colorValue: string): void {
    if (this.project) {
      this.project.garmentColor = colorValue;
    }
  }
  selectSize(size: string): void {
    if (this.project) {
      this.project.garmentSize = size as any;
    }
  }
  handleTextAdded(textProps: TextProperties): void {
    console.log('Text added:', textProps);

    // Create a new Layer for the text
    const textLayer = new Layer();
    textLayer.id = 'text_' + Date.now(); // Generate a unique ID
    textLayer.type = 'text';
    textLayer.zIndex = this.textLayers.length + 1;
    textLayer.isVisible = true; // Create the text content with default positioning
    const textContent: TextContent = {
      x: 160 - (textProps.text.length * textProps.fontSize) / 6, // Center position horizontally based on text length
      y: 150,
      rotation: 0,
      opacity: 1,
      text: textProps.text,
      fontFamily: textProps.fontFamily,
      fontSize: textProps.fontSize,
      fontWeight: textProps.fontWeight,
      color: textProps.color,
      textAlign: textProps.textAlign,
      italic: textProps.italic || false,
      underline: textProps.underline || false,
    };

    textLayer.content = textContent;

    // Add the layer to the text layers array
    this.textLayers.push(textLayer);
  }
  handleImageAdded(imageProps: ImageProperties): void {
    console.log('Image added:', imageProps);

    // Create a new Layer for the image
    const imageLayer = new Layer();
    imageLayer.id = 'img_' + Date.now(); // Generate a unique ID
    imageLayer.type = 'image';
    imageLayer.zIndex = this.imageLayers.length + 1;
    imageLayer.isVisible = true;

    // Create the image content with default positioning
    const imageContent: ImageContent = {
      x: 100, // Default position in the center of the t-shirt
      y: 100,
      rotation: 0,
      opacity: 1,
      imageUrl: imageProps.imageUrl,
      width: imageProps.width,
      height: imageProps.height,
      scale: imageProps.scale,
      maintainAspectRatio: imageProps.maintainAspectRatio,
    };

    imageLayer.content = imageContent;

    // Add the layer to the image layers array
    this.imageLayers.push(imageLayer);
  }
  getBackgroundPosition(colorValue: string): string {
    // Find the index of the color in the garmentColors array
    const colorIndex = this.garmentColors.findIndex(
      (color) => color.value === colorValue
    );

    if (colorIndex === -1) return '0% 0%'; // Default to first position if not found

    // Calculate row and column (0-3) based on the index
    const row = Math.floor(colorIndex / 4);
    const col = colorIndex % 4;

    // Each cell is 25% of the image width/height
    // Multiply by 100/3 to get percentage (33.33%)
    const xPos = col * (100 / 3);
    const yPos = row * (100 / 3);

    return `${xPos}% ${yPos}%`;
  }

  getTextContent(layer: Layer): TextContent {
    return layer.content as TextContent;
  }

  getImageContent(layer: Layer): ImageContent {
    return layer.content as ImageContent;
  }

  saveProject(): void {
    if (!this.project) {
      return;
    }

    this.loading = true;
    this.projectService.update(this.project.id, this.project).subscribe({
      next: () => {
        this.loading = false;
        this.goBack();
      },
      error: (err) => {
        console.error('Error saving project:', err);
        this.error = 'Failed to save project. Please try again.';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/design-lab', this.projectId]);
  }

  // Start dragging a layer
  startDrag(event: MouseEvent, layer: Layer): void {
    // Prevent default to avoid text selection during drag
    event.preventDefault();

    this.draggedLayer = layer;
    this.startX = event.clientX - layer.content.x;
    this.startY = event.clientY - layer.content.y;
  }

  // Handle mouse move for dragging
  onMouseMove(event: MouseEvent): void {
    if (!this.draggedLayer) return;

    // Calculate new position
    const newX = event.clientX - this.startX;
    const newY = event.clientY - this.startY;

    // Update the layer's position
    this.draggedLayer.content.x = newX;
    this.draggedLayer.content.y = newY;
  }
  // End dragging
  onMouseUp(): void {
    this.draggedLayer = null;
  }

  // Delete a layer
  deleteLayer(
    event: MouseEvent,
    layer: Layer,
    layerType: 'text' | 'image'
  ): void {
    // Prevent the event from propagating to the parent elements
    event.stopPropagation();

    if (layerType === 'text') {
      // Remove the text layer from the array
      this.textLayers = this.textLayers.filter((l) => l.id !== layer.id);
    } else if (layerType === 'image') {
      // Remove the image layer from the array
      this.imageLayers = this.imageLayers.filter((l) => l.id !== layer.id);
    }
  }
}