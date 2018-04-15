import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PageScrollInstance, PageScrollService } from 'ngx-page-scroll';

@Injectable()
export class SectionService {

  scrollRoot: HTMLElement;

  private _currentSectionName$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  private _sectionNames$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _sectionPositionMap: Map<string, number> = new Map<string, number>();

  constructor(private _pageScrollService: PageScrollService) {
  }

  addSection(sectionName: string, position: number) {
    this._sectionPositionMap.set(sectionName, position);
    if (!this._sectionNames$.getValue().includes(sectionName)) {
      const updatedSectionNames = this._sectionNames$.getValue().concat(sectionName);
      updatedSectionNames.sort((a: string, b: string) => {
        return this._sectionPositionMap.get(b) - this._sectionPositionMap.get(a);
      });
      this._sectionNames$.next(updatedSectionNames);
    }

    this.refreshCurrentSectionName();
  }

  get currentSectionName$(): Observable<string> {
    return this._currentSectionName$.distinctUntilChanged();
  }

  get sectionNames$(): Observable<string[]> {
    return this._sectionNames$.map(names => names.slice());
  }

  refreshCurrentSectionName(): void {
    const currentSectionNames = this._sectionNames$.getValue();
    //if the page has already been scrolled find the current name
    if (this.scrollRoot.scrollTop > 0) {
      const topSectionName = currentSectionNames.find(sectionName => {
        return (this._sectionPositionMap.get(sectionName) - this.scrollRoot.scrollTop + -1) < 0;
      });

      if (topSectionName) {
        this._currentSectionName$.next(topSectionName);
      } else {
        const firstSectionName = currentSectionNames[currentSectionNames.length - 1];
        this._currentSectionName$.next(firstSectionName ? firstSectionName : undefined);
      }
    } else {
      const firstSectionName = currentSectionNames[currentSectionNames.length - 1];
      this._currentSectionName$.next(firstSectionName ? firstSectionName : undefined);
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
