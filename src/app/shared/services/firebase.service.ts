import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FirebaseCalendar, FirebaseData, FirebaseGuestbook } from '../models/firebase-data';
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

  updateFirebaseGuestbook(updatedGuestbook: FirebaseGuestbook): Observable<void> {
    let guestbookToSave: FirebaseGuestbook;
    if (this._guestbookData$.getValue()) {
      guestbookToSave = cloneDeep(this._guestbookData$.value);
      guestbookToSave.metadata = updatedGuestbook.metadata;
      const newReviewIds = updatedGuestbook.reviews.map(review => review.id);
      guestbookToSave.reviews = guestbookToSave.reviews.filter(oldReview => {
        return !newReviewIds.includes(oldReview.id);
      });
      updatedGuestbook.reviews.forEach(review => guestbookToSave.reviews.push(review));
    } else {
      guestbookToSave = updatedGuestbook;
    }
    return fromPromise(
      this._afs.collection('data').doc<FirebaseGuestbook>(`guestbook`)
        .set(guestbookToSave)
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
