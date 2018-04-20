import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
import { NavItem } from '../../models/nav-item';

@Injectable()
export class SectionService {

  scrollRoot: HTMLElement;

  private _currentSectionId$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  private _sectionIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _sectionPositionMap: Map<string, number> = new Map<string, number>();
  private _sectionNameMap: Map<string, string> = new Map<string, string>();

  constructor(private _pageScrollService: PageScrollService) {
  }

  addSection(sectionId: string, sectionName: string, position: number) {
    this._sectionPositionMap.set(sectionId, position);
    this._sectionNameMap.set(sectionId, sectionName);
    if (!this._sectionIds$.getValue().includes(sectionId)) {
      const updatedSectionNames = this._sectionIds$.getValue().concat(sectionId);
      updatedSectionNames.sort((a: string, b: string) => {
        return this._sectionPositionMap.get(b) - this._sectionPositionMap.get(a);
      });
      this._sectionIds$.next(updatedSectionNames);
    }

    this.refreshCurrentSectionName();
  }

  get currentSectionId$(): Observable<string> {
    return this._currentSectionId$.distinctUntilChanged();
  }

  get navItems$(): Observable<NavItem[]> {
    return this._sectionIds$
      .map(names =>
        names.map(id => ({id: id, nameKey: this._sectionNameMap.get(id)}))
      );
  }

  refreshCurrentSectionName(): void {
    const currentSectionNames = this._sectionIds$.getValue();
    //if the page has already been scrolled find the current name
    if (this.scrollRoot.scrollTop > 0) {
      const topSectionName = currentSectionNames.find(sectionName => {
        return (this._sectionPositionMap.get(sectionName) - this.scrollRoot.scrollTop + -1) < 0;
      });

      if (topSectionName) {
        this._currentSectionId$.next(topSectionName);
      } else {
        const firstSectionName = currentSectionNames[currentSectionNames.length - 1];
        this._currentSectionId$.next(firstSectionName ? firstSectionName : undefined);
      }
    } else {
      const firstSectionName = currentSectionNames[currentSectionNames.length - 1];
      this._currentSectionId$.next(firstSectionName ? firstSectionName : undefined);
    }
  }

  scrollTo(anchorId: string) {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: document,
      scrollTarget: `#${anchorId}`,
      scrollingViews: [this.scrollRoot]
    });
    this._pageScrollService.start(pageScrollInstance);
  }
}
