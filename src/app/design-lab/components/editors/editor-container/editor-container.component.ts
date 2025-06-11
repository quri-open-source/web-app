import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TshirtColorEditorComponent } from '../tshirt-color-editor/tshirt-color-editor.component';

import { TextEditorComponent, TextProperties,} from '../text-editor/text-editor.component';

import {ImageEditorComponent, ImageProperties,} from '../image-editor/image-editor.component';

export type EditorTab = 'color' | 'text' | 'image';

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

export class EditorContainerComponent {
  @Input() currentColor: any = '';
  @Input() initialTab: EditorTab = 'color';

  @Output() colorSelected = new EventEmitter<string>();
  @Output() textAdded = new EventEmitter<TextProperties>();
  @Output() imageAdded = new EventEmitter<ImageProperties>();

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

  onColorSelected(color: string): void {
    this.colorSelected.emit(color);
  }

  onTextAdded(textProps: TextProperties): void {
    this.textAdded.emit(textProps);
  }

  onImageAdded(imageProps: ImageProperties): void {
    this.imageAdded.emit(imageProps);
  }
}