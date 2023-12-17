import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../shared/services/translation.service';
import { SectionService } from '../../shared/services/section.service';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { NavItem } from '../../shared/models/nav-item';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  languages: Language[] = TranslationService.languages;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService) {
  }

  get sections$(): Observable<NavItem[]> {
    return this._sectionService.navItems$.pipe(
      map(names => names.reverse()),
      distinctUntilChanged((sections1: NavItem[], sections2: NavItem[]) => {
        const value1 = sections1.map(section => section.nameKey);
        const value2 = sections2.map(section => section.nameKey);
        return isEqual(value1, value2);
      }),
    );
  }

  get currentSection$(): Observable<string | undefined> {
    return this._sectionService.currentSectionId$;
  }

  get currentLanguage$() {
    return this._translationService.currentLanguage$;
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }

  languageSelected(language: Language) {
    this._translationService.currentLanguageOrBrowserLanguage = language;
  }
}
