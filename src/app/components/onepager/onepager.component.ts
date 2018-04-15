import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';

@Component({
  selector: 'bnb-onepager',
  templateUrl: './onepager.component.html',
  styleUrls: ['./onepager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnepagerComponent {
  constructor(elem: ElementRef, private _sectionService: SectionService) {
    _sectionService.scrollRoot = elem.nativeElement;
  }

  @HostListener('scroll', [])
  onWindowScroll() {
    this._sectionService.refreshCurrentSectionName();
  }
}
