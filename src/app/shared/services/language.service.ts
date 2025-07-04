import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly defaultLanguage = 'en';
  private readonly availableLanguages = ['en', 'es'];

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Set default language
    this.translate.setDefaultLang(this.defaultLanguage);

    // Get saved language or detect browser language
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = this.translate.getBrowserLang();

    let languageToUse = this.defaultLanguage;

    if (savedLanguage && this.availableLanguages.includes(savedLanguage)) {
      languageToUse = savedLanguage;
    } else if (browserLanguage && this.availableLanguages.includes(browserLanguage)) {
      languageToUse = browserLanguage;
    }

    this.translate.use(languageToUse);
    localStorage.setItem('language', languageToUse);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.defaultLanguage;
  }

  getAvailableLanguages(): string[] {
    return this.availableLanguages;
  }

  setLanguage(lang: string): void {
    if (this.availableLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('language', lang);
    }
  }
}
