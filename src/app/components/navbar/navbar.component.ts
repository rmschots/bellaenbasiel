import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';
import { Observable } from 'rxjs/Observable';
import { NavItem } from '../../shared/models/nav-item';
import { Language } from '../../shared/models/language';
import { TranslationService } from '../../shared/services/translation.service';
import { Unsubscribable } from '../../shared/util/unsubscribable';

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
    this.currentSection$.takeUntil(this.ngUnsubscribe$).subscribe(data => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
    this.sections$.takeUntil(this.ngUnsubscribe$).subscribe(data => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
  }

  get sections$(): Observable<NavItem[]> {
    return this._sectionService.navItems$.map(names => names.reverse());
  }

  get currentSection$(): Observable<string> {
    return this._sectionService.currentSectionId$;
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
