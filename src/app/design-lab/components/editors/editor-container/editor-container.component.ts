import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TshirtColorEditorComponent } from '../tshirt-color-editor/tshirt-color-editor.component';
import {
  TextEditorComponent,
  TextProperties,
} from '../text-editor/text-editor.component';
import {
  ImageEditorComponent,
  ImageProperties,
} from '../image-editor/image-editor.component';

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
    ImageEditorComponent,
  ],
  template: `
    <div class="editor-container">
      <mat-tab-group
        [(selectedIndex)]="selectedTabIndex"
        animationDuration="300ms"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>palette</mat-icon>
            <span class="tab-label">T-Shirt Color</span>
          </ng-template>
          <app-tshirt-color-editor
            [selectedColor]="currentColor"
            (colorSelected)="onColorSelected($event)"
          >
          </app-tshirt-color-editor>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>text_fields</mat-icon>
            <span class="tab-label">Add Text</span>
          </ng-template>
          <app-text-editor
            [initialText]="initialTextProps"
            (textAdded)="onTextAdded($event)"
          >
          </app-text-editor>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>image</mat-icon>
            <span class="tab-label">Add Image</span>
          </ng-template>
          <app-image-editor (imageAdded)="onImageAdded($event)">
          </app-image-editor>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .editor-container {
        width: 100%;
      }

      ::ng-deep .mat-mdc-tab-header {
        margin-bottom: 24px;
      }

      .tab-label {
        margin-left: 8px;
      }

      ::ng-deep .mat-mdc-tab .mdc-tab__content {
        display: flex;
        align-items: center;
      }

      ::ng-deep .mat-mdc-card {
        margin-bottom: 16px;
      }

      ::ng-deep .mat-mdc-card-content {
        padding: 16px;
      }
    `,
  ],
})
export class EditorContainerComponent {
  @Input() currentColor: string = '';
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