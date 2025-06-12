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
import { Layer, TextLayer, ImageLayer } from '../../model/layer.entity';
import { EditorContainerComponent, EditorContainerConfig } from '../editors/editor-container/editor-container.component';
import { TextProperties } from '../editors/text-editor/text-editor.component';
import { ImageProperties } from '../editors/image-editor/image-editor.component';
import { GARMENT_COLOR, GARMENT_SIZE, LayerType } from '../../../const';
import { ProjectResponse, LayerResponse } from '../../services/project.response';
import { ProjectAssembler } from '../../services/project.assembler';

interface GarmentColorOption {
  label: string;
  value: GARMENT_COLOR;
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
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  providers: [ProjectService],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  loading = true;
  error: string | null = null;
  projectId: string = '';
  textLayers: TextLayer[] = [];
  imageLayers: ImageLayer[] = [];
  // For dragging functionality
  private draggedLayer: Layer | null = null;
  private startX: number = 0;
  private startY: number = 0;
  private boundMouseMove: any;
  private boundMouseUp: any;

  // Editor container configuration
  editorConfig: EditorContainerConfig = {
    textEditor: {
      defaultPosition: { x: 160, y: 150 },
      centerTextCalculation: true,
      defaultZIndex: 1
    },
    imageEditor: {
      defaultPosition: { x: 100, y: 100 },
      maxImageSize: { width: 300, height: 300 },
      defaultZIndex: 1,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 5 * 1024 * 1024 // 5MB
    },
    enableLayerManagement: true
  };

  // Garment colors configuration
  garmentColors: GarmentColorOption[] = [
    { label: 'black', value: GARMENT_COLOR.BLACK },
    { label: 'gray', value: GARMENT_COLOR.GRAY },
    { label: 'light-gray', value: GARMENT_COLOR.LIGHT_GRAY },
    { label: 'white', value: GARMENT_COLOR.WHITE },
    { label: 'red', value: GARMENT_COLOR.RED },
    { label: 'pink', value: GARMENT_COLOR.PINK },
    { label: 'light-purple', value: GARMENT_COLOR.LIGHT_PURPLE },
    { label: 'purple', value: GARMENT_COLOR.PURPLE },
    { label: 'light-blue', value: GARMENT_COLOR.LIGHT_BLUE },
    { label: 'cyan', value: GARMENT_COLOR.CYAN },
    { label: 'sky-blue', value: GARMENT_COLOR.SKY_BLUE },
    { label: 'blue', value: GARMENT_COLOR.BLUE },
    { label: 'green', value: GARMENT_COLOR.GREEN },
    { label: 'light-green', value: GARMENT_COLOR.LIGHT_GREEN },
    { label: 'yellow', value: GARMENT_COLOR.YELLOW },
    { label: 'dark-yellow', value: GARMENT_COLOR.DARK_YELLOW },
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
    this.error = null;    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        
        // Extract text and image layers from the project
        if (this.project.layers) {
          this.textLayers = this.project.layers.filter(layer => 
            layer.type === LayerType.TEXT) as TextLayer[];
          this.imageLayers = this.project.layers.filter(layer => 
            layer.type === LayerType.IMAGE) as ImageLayer[];
        }
        
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
  selectColor(colorValue: GARMENT_COLOR): void {
    if (this.project) {
      this.project.garmentColor = colorValue;
    }
  }

  selectSize(size: GARMENT_SIZE): void {
    if (this.project) {
      this.project.garmentSize = size;
    }
  }

  // Enhanced event handlers using the new entity-aware approach
  handleGarmentColorChanged(color: GARMENT_COLOR): void {
    this.selectColor(color);
  }

  handleTextLayerCreated(textLayer: TextLayer): void {
    console.log('Text layer created:', textLayer);
    this.textLayers.push(textLayer);
  }

  handleImageLayerCreated(imageLayer: ImageLayer): void {
    console.log('Image layer created:', imageLayer);
    this.imageLayers.push(imageLayer);
  }

  handleLayerAdded(layer: Layer): void {
    console.log('Layer added:', layer);
    // Additional logic for any layer type can be added here
  }

  // Legacy handlers for backward compatibility
  handleTextAdded(textProps: TextProperties): void {
    console.log('Text added (legacy):', textProps);

    // Create a new TextLayer for backward compatibility
    const textLayer = new TextLayer(
      'text_' + Date.now(), // id
      this.editorConfig.textEditor.centerTextCalculation 
        ? this.editorConfig.textEditor.defaultPosition.x - (textProps.text.length * textProps.fontSize) / 6
        : this.editorConfig.textEditor.defaultPosition.x, // x
      this.editorConfig.textEditor.defaultPosition.y, // y
      this.textLayers.length + this.editorConfig.textEditor.defaultZIndex, // zIndex
      1, // opacity
      true, // visible
      textProps.text, // textContent
      textProps.fontSize, // fontSize
      textProps.color, // fontColor
      textProps.fontFamily, // fontFamily
      textProps.fontWeight >= 700, // bold
      textProps.italic || false, // italic
      textProps.underline || false // underline
    );

    this.textLayers.push(textLayer);
  }  handleImageAdded(imageProps: ImageProperties): void {
    console.log('Image added (legacy):', imageProps);

    // Create a new ImageLayer for backward compatibility
    const imageLayer = new ImageLayer(
      'img_' + Date.now(), // id
      this.editorConfig.imageEditor.defaultPosition.x, // x
      this.editorConfig.imageEditor.defaultPosition.y, // y
      this.imageLayers.length + this.editorConfig.imageEditor.defaultZIndex, // zIndex
      1, // opacity
      true, // visible
      imageProps.imageUrl // imageUrl
    );

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

  getTextContent(layer: Layer): TextLayer {
    return layer as TextLayer;
  }

  getImageContent(layer: Layer): ImageLayer {
    return layer as ImageLayer;
  }

  saveProject(): void {
    if (!this.project) {
      return;
    }

    this.loading = true;

    // Update the project layers with the current text and image layers
    this.project.layers = [...this.textLayers, ...this.imageLayers];

    // Convert the Project entity to a ProjectResponse using the ProjectAssembler
    const projectResponse: ProjectResponse = {
      id: this.project.id,
      user_id: this.project.userId,
      name: this.project.name,
      preview_image_url: this.project.previewImageUrl || '',
      status: this.project.status,
      gender: this.project.gender,
      garment_color: this.project.garmentColor,
      garment_size: this.project.garmentSize,
      last_modified: new Date().toISOString(),
      created_at: this.project.createdAt.toISOString(),
      layers: this.convertLayersToResponse(),
    };

    this.projectService.update(this.project.id, projectResponse).subscribe({
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

  private convertLayersToResponse(): LayerResponse[] {
    const allLayers = [...this.textLayers, ...this.imageLayers];
    return allLayers.map((layer) => {
      const baseLayerResponse: LayerResponse = {
        id: layer.id,
        x: layer.x,
        y: layer.y,
        z_index: layer.zIndex,
        opacity: layer.opacity,
        visible: layer.visible,
        type: layer.type,
      };

      if (layer instanceof TextLayer) {
        return {
          ...baseLayerResponse,
          text_content: layer.textContent,
          font_size: layer.fontSize,
          font_color: layer.fontColor,
          font_family: layer.fontFamily,
          bold: layer.bold,
          italic: layer.italic,
          underline: layer.underline,
        };
      } else if (layer instanceof ImageLayer) {
        return {
          ...baseLayerResponse,
          image_url: layer.imageUrl,
        };
      }

      return baseLayerResponse;
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
    this.startX = event.clientX - layer.x;
    this.startY = event.clientY - layer.y;
  }

  // Handle mouse move for dragging
  onMouseMove(event: MouseEvent): void {
    if (!this.draggedLayer) return;

    // Calculate new position
    const newX = event.clientX - this.startX;
    const newY = event.clientY - this.startY;

    // Update the layer's position
    this.draggedLayer.x = newX;
    this.draggedLayer.y = newY;
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