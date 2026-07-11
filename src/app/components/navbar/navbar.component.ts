import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SectionService } from '../../shared/services/section.service';
import { TranslationService } from '../../shared/services/translation.service';
import { Language } from '../../shared/models/language';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NavItem } from '../../shared/models/nav-item';
import { isEqual } from 'lodash-es';

@UntilDestroy()
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class NavbarComponent implements OnInit {

  languages: Language[] = TranslationService.languages;
  menuOpen = false;

  private _hidden$ = new BehaviorSubject<boolean>(false);
  private _lastScrollTop = 0;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService,
              private _cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.currentSection$.pipe(untilDestroyed(this)).subscribe(() => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
    this.sections$.pipe(untilDestroyed(this)).subscribe(() => {
      // hack to make navbar work on admin page
      this._cd.detectChanges();
    });
    this._sectionService.scrollRoot.addEventListener('scroll', () => this.onScroll(), {passive: true});
  }

  get hidden$(): Observable<boolean> {
    return this._hidden$.pipe(distinctUntilChanged());
  }

  get sections$(): Observable<NavItem[]> {
    return this._sectionService.navItems$.pipe(map(names => names.reverse()),
      distinctUntilChanged((sections1: NavItem[], sections2: NavItem[]) =>
        isEqual(sections1.map(section => section.nameKey), sections2.map(section => section.nameKey))));
  }

  get currentSection$(): Observable<string | undefined> {
    return this._sectionService.currentSectionId$;
  }

  get currentLanguage$(): Observable<Language> {
    return this._translationService.currentLanguage$;
  }

  scrollTo(sectionId: string, event?: Event): void {
    event?.preventDefault();
    this.menuOpen = false;
    this._sectionService.scrollTo(sectionId);
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    this.menuOpen = false;
    this._sectionService.scrollRoot.scrollTo({top: 0, behavior: 'smooth'});
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  languageSelected(language: Language): void {
    this._translationService.currentLanguageOrBrowserLanguage = language;
  }

  private onScroll(): void {
    const scrollTop = this._sectionService.scrollRoot.scrollTop;
    const goingDown = scrollTop > this._lastScrollTop + 4;
    const goingUp = scrollTop < this._lastScrollTop - 4;
    if (goingDown || goingUp) {
      this._lastScrollTop = scrollTop;
    }
    if (scrollTop > 180 && goingDown) {
      this._hidden$.next(true);
    } else if (goingUp || scrollTop <= 180) {
      this._hidden$.next(false);
    }
  }
}
