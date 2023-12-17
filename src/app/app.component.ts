import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { TranslationService } from './shared/services/translation.service';
import { SectionService } from './shared/services/section.service';
import { PictureService } from './shared/services/picture.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav, {static: true}) sidenav!: MatSidenav;
  @ViewChild('contentWrapper', {static: true}) el!: ElementRef;

  private _navBarClosed$ = new BehaviorSubject<boolean>(true);

  constructor(public media: MediaObserver,
              private _sectionService: SectionService,
              private _translationService: TranslationService,
              private _pictureService: PictureService) {
    this._translationService.init();
  }

  ngOnInit(): void {
    this._sectionService.scrollRoot = this.el.nativeElement;
    this.el.nativeElement.addEventListener('scroll', () => {
      this._sectionService.refreshCurrentSectionName();
    }, {passive: true});
  }

  get navBarClosed$(): Observable<boolean> {
    return this._navBarClosed$.asObservable();
  }

  get overlayShown$(): Observable<boolean> {
    return this._pictureService.overlayShown$;
  }

  openSidenav() {
    this._navBarClosed$.next(false);
    this.sidenav.open();
  }

  onSidenavClose() {
    this._navBarClosed$.next(true);
  }
}
