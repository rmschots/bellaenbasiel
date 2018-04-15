import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionService } from '../../shared/services/section/section.service';
import { Observable } from 'rxjs/Observable';

interface NavItem {
  id: string;
  nameKey: string;
}

@Component({
  selector: 'bnb-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

  navItems: NavItem[] = [
    {id: 'welcome', nameKey: 'NAV.welcome'},
    {id: 'room', nameKey: 'NAV.room'},
    {id: 'pictures', nameKey: 'NAV.pictures'},
    {id: 'activities', nameKey: 'NAV.activities'},
    {id: 'contact', nameKey: 'NAV.contact'}
  ];

  constructor(private _sectionService: SectionService) {
  }

  get currentSection$(): Observable<string> {
    return this._sectionService.currentSectionName$;
  }

  public scrollTo(sectionId: string): void {
    this._sectionService.scrollTo(sectionId);
  }

}
