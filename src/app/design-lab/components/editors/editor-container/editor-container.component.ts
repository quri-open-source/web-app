import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TshirtColorEditorComponent } from '../tshirt-color-editor/tshirt-color-editor.component';
import { TextEditorComponent, TextProperties, TextEditorConfig } from '../text-editor/text-editor.component';
import { ImageEditorComponent, ImageProperties, ImageEditorConfig } from '../image-editor/image-editor.component';

// Import entities and related types
import { Layer, TextLayer, ImageLayer } from '../../../model/layer.entity';
import { LayerType, GARMENT_COLOR } from '../../../../const';
import { Project } from '../../../model/project.entity';

export type EditorTab = 'color' | 'text' | 'image';

// Configuration interface for the editor container
export interface EditorContainerConfig {
  textEditor: TextEditorConfig;
  imageEditor: ImageEditorConfig;
  enableLayerManagement: boolean;
}

@Component({
  selector: 'app-editor-container',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    TshirtColorEditorComponent,
    TextEditorComponent,
    ImageEditorComponent
  ],
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.css'],
})

export class EditorContainerComponent implements OnInit {
  @Input() currentColor: GARMENT_COLOR | null = null;
  @Input() initialTab: EditorTab = 'color';
  @Input() project: Project | null = null;
  @Input() textLayers: TextLayer[] = [];
  @Input() imageLayers: ImageLayer[] = [];
  @Input() config: EditorContainerConfig = {
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


  @Output() colorSelected = new EventEmitter<GARMENT_COLOR>();
  @Output() textAdded = new EventEmitter<TextProperties>();
  @Output() imageAdded = new EventEmitter<ImageProperties>();


  @Output() garmentColorChanged = new EventEmitter<GARMENT_COLOR>();
  @Output() textLayerCreated = new EventEmitter<TextLayer>();
  @Output() imageLayerCreated = new EventEmitter<ImageLayer>();
  @Output() layerAdded = new EventEmitter<Layer>();

  selectedTabIndex: number = 0;
  // Default text properties
  initialTextProps: TextProperties = {
    text: '',
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 400,
    color: '#000000',
    textAlign: 'center',
  };

  ngOnInit() {
    // Set the initial tab
    switch (this.initialTab) {
      case 'color':
        this.selectedTabIndex = 0;
        break;
      case 'text':
        this.selectedTabIndex = 1;
        break;
      case 'image':
        this.selectedTabIndex = 2;
        break;
    }
  }

  // Enhanced color selection with entity awareness
  onColorSelected(color: GARMENT_COLOR): void {
    this.currentColor = color;
    
    // Emit both legacy and new events
    this.colorSelected.emit(color);
    this.garmentColorChanged.emit(color);

    // Update project if available
    if (this.project) {
      this.project.garmentColor = color;
    }
  }

  // Enhanced text addition with entity creation
  onTextAdded(textProps: TextProperties): void {
    // Emit legacy event for backward compatibility
    this.textAdded.emit(textProps);
  }

  onTextLayerCreated(textLayer: TextLayer): void {
    // Emit new entity-aware events
    this.textLayerCreated.emit(textLayer);
    this.layerAdded.emit(textLayer);
  }

  // Enhanced image addition with entity creation
  onImageAdded(imageProps: ImageProperties): void {
    // Emit legacy event for backward compatibility
    this.imageAdded.emit(imageProps);
  }

  onImageLayerCreated(imageLayer: ImageLayer): void {
    // Emit new entity-aware events
    this.imageLayerCreated.emit(imageLayer);
    this.layerAdded.emit(imageLayer);
  }

  // Utility methods for layer management
  getTotalLayerCount(): number {
    return this.textLayers.length + this.imageLayers.length;
  }

  getNextZIndex(): number {
    return this.getTotalLayerCount() + 1;
  }

  getAllLayers(): Layer[] {
    return [...this.textLayers, ...this.imageLayers].sort((a, b) => a.zIndex - b.zIndex);
  }

  // Check if a specific tab should be disabled
  isTabDisabled(tab: EditorTab): boolean {
    // Add any business logic here to disable tabs based on project state
    return false;
  }

  // Get the current project's garment color for the color editor
  getCurrentGarmentColor(): GARMENT_COLOR | null {
    return this.project?.garmentColor || this.currentColor;
  }
}