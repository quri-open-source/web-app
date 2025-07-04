import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { Project } from '../../model/project.entity';
import { Layer, TextLayer, ImageLayer } from '../../model/layer.entity';
import { EditorContainerComponent, EditorContainerConfig } from '../editors/editor-container/editor-container.component';
import { TextProperties } from '../editors/text-editor/text-editor.component';
import { ImageProperties } from '../editors/image-editor/image-editor.component';
import { GARMENT_COLOR, GARMENT_SIZE } from '../../../const';
import * as htmlToImage from 'html-to-image';

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

})
export class ProjectEditComponent implements OnInit, OnDestroy {
  @ViewChild('tshirtPreview', { static: false }) tshirtPreviewRef!: ElementRef;
  
  project: Project | null = null;
  loading = true;
  error: string | null = null;
  projectId: string = '';
  textLayers: TextLayer[] = [];
  imageLayers: ImageLayer[] = [];
  isGeneratingPreview = false;
  
  private snackBar = inject(MatSnackBar);
  
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
    private projectService: ProjectService,
    private cloudinaryService: CloudinaryService
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
    
    console.log('🔍 ProjectEditComponent - Loading project by ID:', this.projectId);
    
    // Use the specific method to get project by ID
    this.projectService.getUserBlueprintById(this.projectId).subscribe({
      next: (project: Project) => {
        console.log('✅ ProjectEditComponent - Project loaded successfully:', project);
        console.log('🔍 Project layers data:', project.layers);
        this.project = project;
        
        if (this.project && this.project.layers && Array.isArray(this.project.layers)) {
          console.log('🔍 Raw layers from server:', this.project.layers);
          
          // Filter and properly convert text layers
          this.textLayers = this.project.layers
            .filter((layer: any) => layer.type === 'TEXT')
            .map((layer: any) => {
              console.log('📝 Processing text layer:', layer);
              try {
                // Convert dates properly
                const createdAt = layer.createdAt instanceof Date ? layer.createdAt : new Date(layer.createdAt);
                const updatedAt = layer.updatedAt instanceof Date ? layer.updatedAt : new Date(layer.updatedAt);
                
                return new TextLayer(
                  layer.id,
                  Number(layer.x) || 0,
                  Number(layer.y) || 0,
                  Number(layer.z) || 1,
                  Number(layer.opacity) || 1,
                  Boolean(layer.isVisible !== false), // Default to true if not specified
                  createdAt,
                  updatedAt,
                  layer.details || {}
                );
              } catch (error) {
                console.error('❌ Error converting text layer:', layer, error);
                return null;
              }
            })
            .filter(layer => layer !== null) as TextLayer[];
            
          // Filter and properly convert image layers
          this.imageLayers = this.project.layers
            .filter((layer: any) => layer.type === 'IMAGE')
            .map((layer: any) => {
              console.log('🖼️ Processing image layer:', layer);
              try {
                const imageUrl = layer.details?.imageUrl || layer.imageUrl || '';
                console.log('🔗 Image URL found:', imageUrl);
                
                if (!imageUrl) {
                  console.warn('⚠️ No image URL found for layer:', layer.id);
                  return null;
                }
                
                return new ImageLayer(
                  layer.id,
                  Number(layer.x) || 0,
                  Number(layer.y) || 0,
                  Number(layer.z) || 1,
                  Number(layer.opacity) || 1,
                  Boolean(layer.isVisible !== false), // Default to true if not specified
                  imageUrl
                );
              } catch (error) {
                console.error('❌ Error converting image layer:', layer, error);
                return null;
              }
            })
            .filter(layer => layer !== null) as ImageLayer[];
            
          console.log('📝 Text layers loaded and converted:', this.textLayers.length, this.textLayers);
          console.log('🖼️ Image layers loaded and converted:', this.imageLayers.length, this.imageLayers);
          console.log('🖼️ Preview URL:', this.project.previewUrl);
          
          // Debug layers for troubleshooting
          this.debugLayers();
        } else {
          console.log('⚠️ No layers found in project');
          this.textLayers = [];
          this.imageLayers = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ ProjectEditComponent - Error loading project:', err);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error URL:', err.url);
        console.error('❌ Error message:', err.message);
        console.error('❌ Full error object:', err);
        
        // Check if the token is still in localStorage when error occurs
        const currentToken = localStorage.getItem('token');
        console.error('🔑 Token at error time:', currentToken ? `${currentToken.substring(0, 20)}...` : 'NO TOKEN');
        
        if (err.status === 401) {
          console.error('❌ Authentication failed - but NOT redirecting yet for debugging');
          this.error = 'Session expired. Please check console for debugging info.';
          this.loading = false;
          // TEMPORARILY COMMENTED OUT for debugging
          // localStorage.removeItem('token');
          // localStorage.removeItem('userId');
          // this.router.navigate(['/sign-in']);
          return;
        } else if (err.status === 403) {
          this.error = 'You do not have permission to access this project.';
        } else if (err.status === 404) {
          this.error = 'Project not found.';
        } else {
          this.error = 'Failed to load project. Please try again.';
        }
        
        this.loading = false;
      },
    });
  }
  selectColor(colorValue: string): void {
    if (this.project) {
      // Convert string to GARMENT_COLOR enum
      this.project.garmentColor = colorValue as GARMENT_COLOR;
      // Solo actualizar localmente, se enviará al servidor al guardar
    }
  }

  selectSize(size: GARMENT_SIZE): void {
    if (this.project) {
      this.project.garmentSize = size;
      // Solo actualizar localmente, se enviará al servidor al guardar
    }
  }

  // Enhanced event handlers using the new entity-aware approach
  handleGarmentColorChanged(color: string): void {
    this.selectColor(color);
  }

  handleTextLayerCreated(textLayer: TextLayer): void {
    console.log('Text layer created:', textLayer);
    // Don't add to local array yet, wait for server confirmation
    this.createTextLayerOnServer(textLayer);
  }

  handleImageLayerCreated(imageLayer: ImageLayer): void {
    console.log('Image layer created:', imageLayer);
    // Don't add to local array yet, wait for server confirmation
    this.createImageLayerOnServer(imageLayer);
  }

  private createTextLayerOnServer(textLayer: TextLayer): void {
    if (!this.project) return;

    const request = {
      projectId: this.project.id,
      text: textLayer.details.text,
      fontColor: textLayer.details.fontColor,
      fontFamily: textLayer.details.fontFamily,
      fontSize: textLayer.details.fontSize,
      isBold: textLayer.details.isBold,
      isItalic: textLayer.details.isItalic,
      isUnderlined: textLayer.details.isUnderlined
    };

    this.projectService.createTextLayer(request).subscribe({
      next: (response) => {
        console.log('✅ Text layer created on server:', response);
        // Convert server response to TextLayer and add to local array
        const serverTextLayer = this.convertServerResponseToTextLayer(response);
        this.textLayers.push(serverTextLayer);
      },
      error: (err) => {
        console.error('❌ Error creating text layer:', err);
        // Handle error - maybe show a notification
      }
    });
  }

  private createImageLayerOnServer(imageLayer: ImageLayer): void {
    console.log('🖼️ Creating image layer on server:', imageLayer);
    
    if (!this.checkAuthentication()) {
      console.error('❌ Authentication failed - cannot create image layer');
      return;
    }
    
    if (!this.project) {
      console.error('❌ No project available for image layer creation');
      return;
    }

    if (!imageLayer || !imageLayer.imageUrl) {
      console.error('❌ Invalid image layer or missing imageUrl:', imageLayer);
      return;
    }

    const request = {
      imageUrl: imageLayer.imageUrl,
      width: '300', // Use appropriate dimensions
      height: '300'
    };

    console.log('📡 Sending create image layer request:', request);
    console.log('🎯 Project ID:', this.project.id);

    this.projectService.createImageLayer(this.project.id, request).subscribe({
      next: (response) => {
        console.log('✅ Image layer created on server:', response);
        // Convert server response to ImageLayer and add to local array
        const serverImageLayer = this.convertServerResponseToImageLayer(response);
        this.imageLayers.push(serverImageLayer);
        console.log('🎨 Image layer added to local state. Total image layers:', this.imageLayers.length);
      },
      error: (err) => {
        console.error('❌ Error creating image layer on server:', err);
        console.error('Request details:', request);
        console.error('Project ID:', this.project?.id);
        
        if (err.status === 401) {
          console.error('🔒 Authentication error - token may be expired');
          // Here you could show a message to re-login
        }
        // Handle error - maybe show a notification
      }
    });
  }

  private convertServerResponseToTextLayer(response: any): TextLayer {
    return new TextLayer(
      response.id,
      response.x,
      response.y,
      response.z,
      response.opacity,
      response.isVisible,
      new Date(response.createdAt),
      new Date(response.updatedAt),
      response.details
    );
  }

  private convertServerResponseToImageLayer(response: any): ImageLayer {
    return new ImageLayer(
      response.id,
      response.x,
      response.y,
      response.z,
      response.opacity,
      response.isVisible,
      response.details.imageUrl
    );
  }

  handleLayerAdded(layer: Layer): void {
    console.log('Layer added:', layer);
    // Additional logic for any layer type can be added here
  }

  // Legacy handlers for backward compatibility
  handleTextAdded(textProps: TextProperties): void {
    console.log('Text added (legacy):', textProps);
    
    if (!this.project) return;

    const request = {
      projectId: this.project.id,
      text: textProps.text,
      fontColor: textProps.color,
      fontFamily: textProps.fontFamily,
      fontSize: textProps.fontSize,
      isBold: textProps.fontWeight >= 700,
      isItalic: textProps.italic || false,
      isUnderlined: textProps.underline || false
    };

    this.projectService.createTextLayer(request).subscribe({
      next: (response) => {
        console.log('✅ Text layer created on server (legacy):', response);
        const serverTextLayer = this.convertServerResponseToTextLayer(response);
        this.textLayers.push(serverTextLayer);
      },
      error: (err) => {
        console.error('❌ Error creating text layer (legacy):', err);
      }
    });
  }

  handleImageAdded(imageProps: ImageProperties): void {
    console.log('🖼️ Image added via Cloudinary:', imageProps);
    
    if (!this.project) {
      console.error('❌ No project available for image layer creation');
      return;
    }

    const request = {
      imageUrl: imageProps.imageUrl,
      width: imageProps.width.toString(),
      height: imageProps.height.toString()
    };

    console.log('📡 Sending create image layer request:', request);

    this.projectService.createImageLayer(this.project.id, request).subscribe({
      next: (response) => {
        console.log('✅ Image layer created on server:', response);
        const serverImageLayer = this.convertServerResponseToImageLayer(response);
        this.imageLayers.push(serverImageLayer);
        console.log('🎨 Image layer added to local state. Total image layers:', this.imageLayers.length);
      },
      error: (err) => {
        console.error('❌ Error creating image layer on server:', err);
        console.error('Request details:', request);
        console.error('Project ID:', this.project?.id);
      }
    });
  }
  getColorLabel(value: GARMENT_COLOR): string {
    const foundColor = this.garmentColors.find(
      (color) => color.value === value
    );
    return foundColor ? foundColor.label : 'Custom';
  }

  getBackgroundPosition(colorValue: GARMENT_COLOR): string {
    const colorIndex = this.garmentColors.findIndex(
      (color) => color.value === colorValue
    );
    if (colorIndex === -1) return '0% 0%';
    const row = Math.floor(colorIndex / 4);
    const col = colorIndex % 4;
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

  async saveProject(): Promise<void> {
    console.log('💾 Starting save project process...');
    
    if (!this.project) {
      console.error('❌ No project to save');
      this.error = 'No project to save';
      return;
    }

    if (!this.checkAuthentication()) {
      console.error('❌ Authentication failed - cannot save project');
      this.error = 'You must be logged in to save the project';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      // Generar preview antes de guardar
      await this.generateProjectPreview();
      
      // Usar el nuevo endpoint para actualizar solo los detalles del proyecto
      await this.updateProjectDetailsDirectly();
      
      console.log('✅ Project saved successfully using details endpoint');
      this.snackBar.open('Project saved successfully with preview!', 'Close', { duration: 3000 });
      this.loading = false;
      this.goBack();
      
    } catch (error) {
      console.warn('⚠️ Direct save failed, trying legacy method:', error);
      this.saveLegacyProject();
    }
  }

  // Nuevo método para actualizar usando el endpoint de detalles
  private async updateProjectDetailsDirectly(): Promise<void> {
    if (!this.project) return;

    const updateRequest = {
      previewUrl: this.project.previewUrl || undefined,
      status: this.project.status,
      garmentColor: this.project.garmentColor,
      garmentSize: this.project.garmentSize,
      garmentGender: this.project.garmentGender
    };

    console.log('� Saving project using details endpoint:', updateRequest);
    
    await this.projectService.updateProjectDetails(this.project.id, updateRequest).toPromise();
  }

  // Método legacy para fallback
  private saveLegacyProject(): void {
    console.log('🔄 Using legacy save method...');
    
    if (!this.project) {
      console.error('❌ No project to save');
      this.error = 'No project to save';
      this.loading = false;
      return;
    }

    // Update the project layers with the current text and image layers
    this.project.layers = [...this.textLayers, ...this.imageLayers];
    console.log('📊 Total layers to save:', this.project.layers.length);

    // Convert the Project entity to a ProjectResponse
    const projectResponse: any = {
      id: this.project.id,
      userId: this.project.userId,
      title: this.project.title,
      previewUrl: this.project.previewUrl || '',
      status: this.project.status,
      garmentColor: this.project.garmentColor,
      garmentSize: this.project.garmentSize,
      garmentGender: this.project.garmentGender,
      layers: this.convertLayersToResponse(),
      createdAt: this.project.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projectService.updateProject(this.project.id, projectResponse).subscribe({
      next: () => {
        console.log('✅ Project saved successfully using legacy method');
        this.snackBar.open('Project saved successfully!', 'Close', { duration: 3000 });
        this.loading = false;
        this.goBack();
      },
      error: (err: any) => {
        console.error('❌ Error saving project:', err);
        this.error = 'Failed to save project. Please try again.';
        this.loading = false;
      }
    });
  }

  private convertLayersToResponse(): any[] {
    const allLayers = [...this.textLayers, ...this.imageLayers];
    return allLayers.map((layer) => {
      const baseLayerResponse = {
        id: layer.id,
        x: layer.x,
        y: layer.y,
        z: layer.z,
        opacity: layer.opacity,
        isVisible: layer.isVisible,
        type: layer.type,
        createdAt: layer.createdAt.toISOString(),
        updatedAt: layer.updatedAt.toISOString(),
        details: layer.details || {},
      };
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

  private checkAuthentication(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    console.log('🔐 Authentication check:');
    console.log('  - Token present:', !!token);
    console.log('  - User ID present:', !!userId);
    
    if (!token || !userId) {
      console.error('❌ User not authenticated. Redirecting to sign-in...');
      // Here you could redirect to sign-in page
      return false;
    }
    
    return true;
  }

  // Generar preview del proyecto (método privado, solo se llama al guardar)
  private async generateProjectPreview(): Promise<void> {
    if (!this.project || !this.tshirtPreviewRef) {
      console.error('❌ No project or preview element available');
      return;
    }

    this.isGeneratingPreview = true;
    
    try {
      console.log('📸 Generating project preview...');
      
      // Capturar el contenedor como imagen
      const previewElement = this.tshirtPreviewRef.nativeElement;
      
      // Opciones para html-to-image
      const options = {
        quality: 0.95,
        width: previewElement.offsetWidth,
        height: previewElement.offsetHeight,
        backgroundColor: '#ffffff',
        useCORS: true
      };

      // Convertir el elemento a blob
      const blob = await htmlToImage.toBlob(previewElement, options);
      
      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      console.log('✅ Image generated successfully');

      // Subir la imagen a Cloudinary
      const previewUrl = await this.uploadPreviewToCloudinary(blob);
      
      // Actualizar la URL del preview en el proyecto localmente
      this.project.previewUrl = previewUrl;
      
      // Actualizar la URL del preview en el servidor
      await this.updateProjectPreviewOnServer(previewUrl);
      
      console.log('✅ Preview URL updated:', previewUrl);
      
    } catch (error) {
      console.error('❌ Error generating preview:', error);
      // No mostramos error al usuario aquí, ya que es parte del proceso de guardado
      console.warn('⚠️ Preview generation failed, but project will still be saved');
    } finally {
      this.isGeneratingPreview = false;
    }
  }

  private async updateProjectPreviewOnServer(previewUrl: string): Promise<void> {
    if (!this.project) return;
    
    try {
      // Usar el nuevo endpoint para actualizar los detalles del proyecto
      const updateRequest = {
        previewUrl: previewUrl,
        status: this.project.status,
        garmentColor: this.project.garmentColor,
        garmentSize: this.project.garmentSize,
        garmentGender: this.project.garmentGender
      };
      
      console.log('📡 Updating project details with new preview URL:', updateRequest);
      
      await this.projectService.updateProjectDetails(this.project.id, updateRequest).toPromise();
      console.log('✅ Project details updated successfully on server');
      
    } catch (error) {
      console.error('❌ Error updating project details on server:', error);
      // No lanzamos el error para no interrumpir el proceso de guardado
    }
  }

  private async uploadPreviewToCloudinary(blob: Blob): Promise<string> {
    try {
      return await this.cloudinaryService.uploadBlob(blob, 'teelab_previews');
    } catch (error) {
      console.error('❌ Error uploading preview to Cloudinary:', error);
      throw error;
    }
  }

  // Métodos para actualizar capas existentes
  updateTextLayerDetails(layer: TextLayer): void {
    if (!this.project) return;

    const request = {
      text: layer.details.text,
      fontColor: layer.details.fontColor,
      fontFamily: layer.details.fontFamily,
      fontSize: layer.details.fontSize,
      isBold: layer.details.isBold,
      isItalic: layer.details.isItalic,
      isUnderlined: layer.details.isUnderlined
    };

    this.projectService.updateTextLayer(this.project.id, layer.id, request).subscribe({
      next: (response) => {
        console.log('✅ Text layer updated successfully:', response);
        // Actualizar la capa local con la respuesta del servidor
        const updatedLayer = this.convertServerResponseToTextLayer(response);
        const index = this.textLayers.findIndex(l => l.id === layer.id);
        if (index !== -1) {
          this.textLayers[index] = updatedLayer;
        }
      },
      error: (err) => {
        console.error('❌ Error updating text layer:', err);
        this.snackBar.open('Error updating text layer', 'Close', { duration: 3000 });
      }
    });
  }

  updateImageLayerDetails(layer: ImageLayer, width?: string, height?: string): void {
    if (!this.project) return;

    const request = {
      imageUrl: layer.imageUrl,
      width: width || '300',
      height: height || '300'
    };

    this.projectService.updateImageLayer(this.project.id, layer.id, request).subscribe({
      next: (response) => {
        console.log('✅ Image layer updated successfully:', response);
        // Actualizar la capa local con la respuesta del servidor
        const updatedLayer = this.convertServerResponseToImageLayer(response);
        const index = this.imageLayers.findIndex(l => l.id === layer.id);
        if (index !== -1) {
          this.imageLayers[index] = updatedLayer;
        }
      },
      error: (err) => {
        console.error('❌ Error updating image layer:', err);
        this.snackBar.open('Error updating image layer', 'Close', { duration: 3000 });
      }
    });
  }

  // Métodos para manejar cambios en tiempo real de las capas
  onTextLayerChanged(layer: TextLayer): void {
    console.log('📝 Text layer changed:', layer);
    // Actualizar la capa en el servidor cuando el usuario termine de editarla
    // Puedes implementar un debounce aquí para evitar demasiadas requests
    this.updateTextLayerDetails(layer);
  }

  onImageLayerChanged(layer: ImageLayer): void {
    console.log('🖼️ Image layer changed:', layer);
    // Actualizar la capa en el servidor
    this.updateImageLayerDetails(layer);
  }

  // Método para debugging - mostrar información de layers
  debugLayers(): void {
    console.log('🐛 DEBUG - Current layers state:');
    console.log('Text layers count:', this.textLayers.length);
    console.log('Image layers count:', this.imageLayers.length);
    
    this.textLayers.forEach((layer, index) => {
      console.log(`Text Layer ${index}:`, {
        id: layer.id,
        text: layer.details?.text,
        x: layer.x,
        y: layer.y,
        visible: layer.isVisible,
        details: layer.details
      });
    });
    
    this.imageLayers.forEach((layer, index) => {
      console.log(`Image Layer ${index}:`, {
        id: layer.id,
        imageUrl: layer.imageUrl || layer.details?.imageUrl,
        x: layer.x,
        y: layer.y,
        visible: layer.isVisible,
        details: layer.details
      });
    });
  }

  // Track function para optimizar rendering de layers
  trackLayerById(index: number, layer: Layer): string {
    return layer.id;
  }

  // Manejar errores de carga de imágenes
  onImageLoadError(layer: ImageLayer): void {
    console.log('❌ Image load error for layer:', layer.id);
    console.log('🔗 Attempted URL:', layer.imageUrl || layer.details?.imageUrl);
    console.log('📄 Layer details:', layer.details);
  }

  // Actualizar detalles del proyecto en el servidor (método público para testing manual)
  updateProjectDetailsOnServer(): void {
    if (!this.project) return;

    const updateRequest = {
      previewUrl: this.project.previewUrl || undefined,
      status: this.project.status,
      garmentColor: this.project.garmentColor,
      garmentSize: this.project.garmentSize,
      garmentGender: this.project.garmentGender
    };

    console.log('📡 Manually updating project details:', updateRequest);

    this.projectService.updateProjectDetails(this.project.id, updateRequest).subscribe({
      next: (response) => {
        console.log('✅ Project details updated successfully:', response);
        this.snackBar.open('Project details updated!', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('❌ Error updating project details:', err);
        this.snackBar.open('Error updating project details', 'Close', { duration: 3000 });
      }
    });
  }
}
