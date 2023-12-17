import { Component } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { SectionService } from '../../../shared/services/section.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private _sectionService: SectionService, public media: MediaObserver) {
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }
}
