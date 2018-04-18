import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageScrollConfig } from 'ngx-page-scroll';
import { ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { SectionService } from './shared/services/section/section.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from './shared/services/translation.service';

@Component({
  selector: 'bnb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav;
  @ViewChild('contentWrapper') el: ElementRef;

  private _navBarClosed$ = new BehaviorSubject<boolean>(true);

  constructor(public media: ObservableMedia,
              private _sectionService: SectionService,
              private _translationService: TranslationService) {
    this._translationService.init();
    this.configurePageScroll();
  }

  ngOnInit(): void {
    this._sectionService.scrollRoot = this.el.nativeElement;
    this.el.nativeElement.addEventListener('scroll', () => {
      this._sectionService.refreshCurrentSectionName();
    });
  }

  get navBarClosed$(): Observable<boolean> {
    return this._navBarClosed$.asObservable();
  }

  openSidenav() {
    this._navBarClosed$.next(false);
    this.sidenav.open();
  }

  onSidenavClose() {
    this._navBarClosed$.next(true);
  }

  private configurePageScroll() {
    PageScrollConfig.defaultEasingLogic = {
      ease: (t: number, b: number, c: number, d: number): number => {
        // easeInOutExpo easing
        if (t === 0) return b;
        if (t === d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    };
    PageScrollConfig.defaultDuration = 750;
  }
}
