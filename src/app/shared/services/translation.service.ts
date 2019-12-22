import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Language } from '../models/language';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class TranslationService {

  static languages: Language[] = [
    {code: 'en', name: 'English'},
    {code: 'nl', name: 'Nederlands'},
    {code: 'fr', name: 'Français'}
  ];

  private _currentLanguage$: BehaviorSubject<Language> = new BehaviorSubject<Language>(undefined);

  constructor(private _translateService: TranslateService) {
  }

  init() {
    this.initializeLanguage();
    this.listenToLanguageChanges();
  }

  set currentLanguageOrBrowserLanguage(language: Language) {
    this._translateService.use(language.code);
  }

  get browserLanguage(): string {
    return this._translateService.getBrowserLang();
  }

  get currentLanguage$(): Observable<Language> {
    return this._currentLanguage$.pipe(distinctUntilChanged());
  }

  private initializeLanguage() {
    let languageToUse = localStorage.getItem('language') || this._translateService.getBrowserLang();
    if (!TranslationService.languages.map(lang => lang.code).includes(languageToUse)) {
      languageToUse = 'en';
    }
    this._translateService.setDefaultLang('en');
    this._translateService.use(languageToUse);
    localStorage.setItem('language', languageToUse);
    this._currentLanguage$.next(TranslationService.languages.find(lang => lang.code === languageToUse));
  }

  private listenToLanguageChanges() {
    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      const newLang = event.lang;
      if (!TranslationService.languages.map(lang => lang.code).includes(newLang)) {
        this.initializeLanguage();
      } else {
        localStorage.setItem('language', newLang);
        this._currentLanguage$.next(TranslationService.languages.find(lang => lang.code === newLang));
      }
    });
  }

}
