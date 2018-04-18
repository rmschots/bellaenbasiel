import { Component } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';
import { Observable } from 'rxjs/Observable';
import { NavItem } from '../../shared/models/nav-item';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'bnb-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  navItems: NavItem[] = [
    {id: 'welcome', nameKey: 'NAV.welcome'},
    {id: 'room', nameKey: 'NAV.room'},
    {id: 'pictures', nameKey: 'NAV.pictures'},
    {id: 'activities', nameKey: 'NAV.activities'},
    {id: 'contact', nameKey: 'NAV.contact'}
  ];

  languages: Language[] = TranslationService.languages;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService) {
  }

  get currentSection$(): Observable<string> {
    return this._sectionService.currentSectionName$;
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }

  languageSelected(language: Language) {
    this._translationService.currentLanguage = language;
  }

  get currentLanguage$() {
    return this._translationService.currentLanguage$;
  }
}
