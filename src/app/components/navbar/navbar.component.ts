import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';
import { Observable } from 'rxjs';
import { NavItem } from '../../shared/models/nav-item';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../shared/services/translation.service';
import { Unsubscribable } from '../../shared/util/unsubscribable';
import { isEqual } from 'lodash';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bnb-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent extends Unsubscribable implements OnInit {

  languages: Language[] = TranslationService.languages;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService,
              private _cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.currentSection$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(data => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
    this.sections$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(data => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
  }

  get sections$(): Observable<NavItem[]> {
    return this._sectionService.navItems$.pipe(map(names => names.reverse()),
      distinctUntilChanged((sections1: NavItem[], sections2: NavItem[]) =>
        isEqual(sections1.map(section => section.nameKey), sections2.map(section => section.nameKey))));
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
