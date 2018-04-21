import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GuestbookEntry } from '../../../shared/models/firebase-data';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';

@Component({
  selector: 'bnb-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookComponent extends Unsubscribable {

  private _entries$: BehaviorSubject<GuestbookEntry[]> = new BehaviorSubject<GuestbookEntry[]>([]);
  private _entryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _currentEntry$: BehaviorSubject<GuestbookEntry> = new BehaviorSubject<GuestbookEntry>(undefined);

  constructor(private _firebaseService: FirebaseService) {
    super();
    this._firebaseService.guestbookData$
      .filter(data => !!data)
      .takeUntil(this.ngUnsubscribe$).subscribe(data => {
      const entriesCpy: GuestbookEntry[] = cloneDeep(data.entries);
      entriesCpy.sort((entry1, entry2) => this.guestbookEntryComparator(entry1, entry2));
      this._entries$.next(entriesCpy);
      this._currentEntry$.next(entriesCpy[this._entryIndex$.getValue()]);
    });
  }

  get currentEntry$(): Observable<GuestbookEntry> {
    return this._currentEntry$.asObservable();
  }

  get entryIndex$(): Observable<number> {
    return this._entryIndex$.map(index => index + 1);
  }

  get amountOfEntries$(): Observable<number> {
    return this._entries$.map(entries => entries.length);
  }

  prevEntry() {
    this.changeSelected(-1);
  }

  nextEntry() {
    this.changeSelected(1);
  }

  private guestbookEntryComparator = (entry1: GuestbookEntry, entry2: GuestbookEntry) => {
    return (<firebase.firestore.Timestamp>entry2.date).toMillis() - (<firebase.firestore.Timestamp>entry1.date).toMillis();
  }

  private changeSelected(indexOffset: number) {
    const nextIndex = this._entryIndex$.getValue() + indexOffset;
    const amountOfEntries = this._entries$.getValue().length;
    const currentIndexNew = ((nextIndex % amountOfEntries) + amountOfEntries) % amountOfEntries;
    this._entryIndex$.next(currentIndexNew);
    this._currentEntry$.next(this._entries$.getValue()[currentIndexNew]);
  }
}
