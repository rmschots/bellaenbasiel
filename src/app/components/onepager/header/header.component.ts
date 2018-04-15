import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionService } from '../../../shared/services/section/section.service';

@Component({
  selector: 'bnb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  constructor(private _sectionService: SectionService) {
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }
}
