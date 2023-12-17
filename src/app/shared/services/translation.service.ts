import { Injectable } from '@angular/core';
import { distinctUntilChanged, Observable, ReplaySubject } from 'rxjs';
import { Language } from '../models/language';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  static languages: Language[] = [
    {code: 'en', name: 'English'},
    {code: 'nl', name: 'Nederlands'},
    {code: 'fr', name: 'Français'}
  ];

  private _currentLanguage$: ReplaySubject<Language> = new ReplaySubject<Language>(1);

  constructor(private _translateService: TranslocoService) {
  }

  init() {
    this.initializeLanguage();
    this.listenToLanguageChanges();
  }

  set currentLanguageOrBrowserLanguage(language: Language) {
    this._translateService.setActiveLang(language.code);
  }

  get browserLanguage(): string | undefined {
    return getBrowserLang();
  }

  get currentLanguage$(): Observable<Language> {
    return this._currentLanguage$.pipe(distinctUntilChanged());
  }

  private initializeLanguage() {
    let languageToUse = localStorage.getItem('language') || this.browserLanguage || 'en';
    if (!TranslationService.languages.map(lang => lang.code).includes(languageToUse)) {
      languageToUse = 'en';
    }
    this._translateService.setDefaultLang('en');
    this._translateService.setActiveLang(languageToUse);
    localStorage.setItem('language', languageToUse);
    this._currentLanguage$.next(TranslationService.languages.find(lang => lang.code === languageToUse) || TranslationService.languages[0]);
  }

  private listenToLanguageChanges() {
    this._translateService.langChanges$.subscribe((newLang: string) => {
      if (!TranslationService.languages.map(lang => lang.code).includes(newLang)) {
        this.initializeLanguage();
      } else {
        localStorage.setItem('language', newLang);
        this._currentLanguage$.next(TranslationService.languages.find(lang => lang.code === newLang) || TranslationService.languages[0]);
      }
    });
  }
}
