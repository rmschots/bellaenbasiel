import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslationService } from './shared/services/translation.service';
import { SectionService } from './shared/services/section.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  @ViewChild('contentWrapper', {static: true}) el!: ElementRef;

  constructor(private _sectionService: SectionService,
              private _translationService: TranslationService) {
    this._translationService.init();
  }

  ngOnInit(): void {
    this._sectionService.scrollRoot = this.el.nativeElement;
    this.el.nativeElement.addEventListener('scroll', () => {
      this._sectionService.refreshCurrentSectionName();
    }, {passive: true});
  }
}
