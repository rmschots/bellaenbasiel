import { Component } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';
import { Observable } from 'rxjs/Observable';
import { NavItem } from '../../shared/models/nav-item';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../shared/services/translation.service';
import { isEqual } from 'lodash';

@Component({
  selector: 'bnb-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  languages: Language[] = TranslationService.languages;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService) {
  }

  get sections$(): Observable<NavItem[]> {
    return this._sectionService.navItems$.map(names => names.reverse())
      .distinctUntilChanged((sections1: NavItem[], sections2: NavItem[]) =>
        isEqual(sections1.map(section => section.nameKey), sections2.map(section => section.nameKey)));
  }

  get currentSection$(): Observable<string> {
    return this._sectionService.currentSectionId$;
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }

  languageSelected(language: Language) {
    this._translationService.currentLanguageOrBrowserLanguage = language;
  }

  get currentLanguage$() {
    return this._translationService.currentLanguage$;
  }
}
