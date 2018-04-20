import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FirebaseCalendar, FirebaseData } from '../models/firebase-data';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseService {

  private _initialized = false;

  private _sectionsChange$: BehaviorSubject<DocumentChangeAction[]> = new BehaviorSubject<DocumentChangeAction[]>([]);
  private _calendarData$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);

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
  }

  get calendarData$(): Observable<FirebaseCalendar> {
    return this._calendarData$.asObservable();
  }

  private findSection(actions: DocumentChangeAction[], sectionName: string) {
    const foundSectionAction = actions.find(action => action.payload.doc.id === sectionName);
    if (!foundSectionAction) {
      return null;
    }
    return foundSectionAction.payload.doc.data();
  }

}
