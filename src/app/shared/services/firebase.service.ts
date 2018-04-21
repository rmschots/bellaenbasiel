import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FirebaseCalendar, FirebaseData, FirebaseGuestbook, GuestbookEntry } from '../models/firebase-data';
import { Observable } from 'rxjs/Observable';
import { cloneDeep } from 'lodash';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class FirebaseService {

  private _initialized = false;

  private _sectionsChange$: BehaviorSubject<DocumentChangeAction[]> = new BehaviorSubject<DocumentChangeAction[]>([]);
  private _calendarData$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  private _guestbookData$: BehaviorSubject<FirebaseGuestbook> = new BehaviorSubject<FirebaseGuestbook>(undefined);

  constructor(private _afs: AngularFirestore) {
    _afs.firestore.settings({timestampsInSnapshots: true});
  }

  init() {
    if (this._initialized) {
      console.error('firebase service already initialized');
      return;
    }
    this._initialized = true;
    this._afs.collection<FirebaseData>('data').snapshotChanges()
      .subscribe(data => this._sectionsChange$.next(data));
    this._sectionsChange$.map(actions => this.findSection(actions, 'calendar') as FirebaseCalendar)
      .subscribe(data => this._calendarData$.next(data));
    this._sectionsChange$.map(actions => this.findSection(actions, 'guestbook') as FirebaseGuestbook)
      .subscribe(data => this._guestbookData$.next(data));
  }

  createGuestbookEntry(guestbookEntry: GuestbookEntry): Observable<any> {
    const updatedGuestbook: FirebaseGuestbook = cloneDeep(this._guestbookData$.getValue());
    if (!updatedGuestbook.entries) {
      updatedGuestbook.entries = [];
    }
    updatedGuestbook.entries.push(guestbookEntry);
    return fromPromise(
      this._afs.collection('data').doc<FirebaseGuestbook>(`guestbook`)
        .set(updatedGuestbook)
    );
  }

  deleteGuestbookEntry(entry: GuestbookEntry): Observable<any> {
    const updatedGuestbook: FirebaseGuestbook = {entries: this._guestbookData$.getValue().entries.filter(e => e !== entry)};
    return fromPromise(
      this._afs.collection('data').doc<FirebaseGuestbook>(`guestbook`)
        .set(updatedGuestbook)
    );
  }

  get calendarData$(): Observable<FirebaseCalendar> {
    return this._calendarData$.asObservable();
  }

  get guestbookData$(): Observable<FirebaseGuestbook> {
    return this._guestbookData$.asObservable();
  }

  private findSection(actions: DocumentChangeAction[], sectionName: string) {
    const foundSectionAction = actions.find(action => action.payload.doc.id === sectionName);
    if (!foundSectionAction) {
      return null;
    }
    return foundSectionAction.payload.doc.data();
  }
}
