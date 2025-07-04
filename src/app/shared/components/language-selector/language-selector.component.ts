import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="languageMenu">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #languageMenu="matMenu">
      <button mat-menu-item (click)="changeLanguage('en')">
        <mat-icon>flag</mat-icon>
        <span>English</span>
      </button>
      <button mat-menu-item (click)="changeLanguage('es')">
        <mat-icon>flag</mat-icon>
        <span>Español</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .language-selector {
      margin: 0 8px;
    }
  `]
})
export class LanguageSelectorComponent {
  constructor(private translate: TranslateService) {}

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
