import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GuestbookEntry } from '../../../shared/models/guestbook-entry';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GUESTBOOK_ENTRIES } from './guestbook-data';

@Component({
  selector: 'bnb-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookComponent implements OnInit {

  private _entries$: BehaviorSubject<GuestbookEntry[]> = new BehaviorSubject<GuestbookEntry[]>([]);
  private _entryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _currentEntry$: BehaviorSubject<GuestbookEntry> = new BehaviorSubject<GuestbookEntry>(undefined);

  get currentEntry$(): Observable<GuestbookEntry> {
    return this._currentEntry$.asObservable();
  }

  get entryIndex$(): Observable<number> {
    return this._entryIndex$.map(index => index + 1);
  }

  get amountOfEntries$(): Observable<number> {
    return this._entries$.map(entries => entries.length);
  }

  ngOnInit(): void {
    this._entries$.next(GUESTBOOK_ENTRIES);
    this._currentEntry$.next(this._entries$.getValue()[this._entryIndex$.getValue()]);
  }

  prevEntry() {
    this.changeSelected(-1);
  }

  nextEntry() {
    this.changeSelected(1);
  }

  private changeSelected(indexOffset: number) {
    const nextIndex = this._entryIndex$.getValue() + indexOffset;
    const amountOfEntries = this._entries$.getValue().length;
    const currentIndexNew = ((nextIndex % amountOfEntries) + amountOfEntries) % amountOfEntries;
    this._entryIndex$.next(currentIndexNew);
    this._currentEntry$.next(this._entries$.getValue()[currentIndexNew]);
  }
}
