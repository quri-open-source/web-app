import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { TshirtColorEditorComponent } from '../tshirt-color-editor/tshirt-color-editor.component';
import { TextEditorComponent, TextProperties, TextEditorConfig } from '../text-editor/text-editor.component';
import { ImageEditorComponent, ImageProperties, ImageEditorConfig } from '../image-editor/image-editor.component';

// Import entities and related types
import { Layer, TextLayer, ImageLayer } from '../../../model/layer.entity';
import { GARMENT_COLOR } from '../../../../const';
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
    TranslateModule,
    TshirtColorEditorComponent,
    TextEditorComponent,
    ImageEditorComponent
  ],
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.css'],
})

export class EditorContainerComponent implements OnInit {
  @Input() currentColor: string | null = null;
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

  textEditorRef: any;
  imageEditorRef: any;

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

  // Cambia el tab seleccionado
  selectTab(tab: EditorTab) {
    switch (tab) {
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
    this.textAdded.emit(textProps);
    // Limpiar formulario y volver al tab principal
    this.selectTab('color');
  }

  onTextLayerCreated(textLayer: TextLayer): void {
    this.textLayerCreated.emit(textLayer);
    this.layerAdded.emit(textLayer);
    // Limpiar formulario y volver al tab principal
    this.selectTab('color');
  }

  // Enhanced image addition with entity creation
  onImageAdded(imageProps: ImageProperties): void {
    this.imageAdded.emit(imageProps);
    // Limpiar formulario y volver al tab principal
    this.selectTab('color');
  }

  onImageLayerCreated(imageLayer: ImageLayer): void {
    this.imageLayerCreated.emit(imageLayer);
    this.layerAdded.emit(imageLayer);
    // Limpiar formulario y volver al tab principal
    this.selectTab('color');
  }

  // Utility methods for layer management
  getTotalLayerCount(): number {
    return this.textLayers.length + this.imageLayers.length;
  }

  getNextZIndex(): number {
    return this.getTotalLayerCount() + 1;
  }

  getAllLayersSorted(): (TextLayer | ImageLayer)[] {
    return [...this.textLayers, ...this.imageLayers].sort((a, b) => a.z - b.z);
  }

  // Check if a specific tab should be disabled
  isTabDisabled(_tab: EditorTab): boolean {
    // Add any business logic here to disable tabs based on project state
    return false;
  }

  // Get the current project's garment color for the color editor
  getCurrentColor(): GARMENT_COLOR | null {
    // Si el color es string, lo convertimos a enum si es posible
    const color = this.project?.garmentColor || this.currentColor;
    if (!color) return null;
    // Si ya es del tipo enum, lo devolvemos
    if (Object.values(GARMENT_COLOR).includes(color as GARMENT_COLOR)) {
      return color as GARMENT_COLOR;
    }
    // Si es string, intentamos mapearlo a enum (por si viene en mayúsculas)
    const found = Object.values(GARMENT_COLOR).find(e => e === color.toUpperCase());
    return found ? (found as GARMENT_COLOR) : null;
  }
}
