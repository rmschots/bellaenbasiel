import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionService } from '../../../shared/services/section.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class HeaderComponent {

  constructor(private _sectionService: SectionService) {
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault();
    this._sectionService.scrollTo(sectionId);
  }
}
