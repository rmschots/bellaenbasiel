import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FirebaseCalendar,
  FirebaseData,
  FirebaseGallery,
  FirebaseGuestbook,
  FirebasePicture
} from '../models/firebase-data';
import { cloneDeep } from 'lodash';
import { PictureService } from './picture.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, tap } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';

export const pictureComparator = (a, b) => {
  return a.ordered ? b.ordered ? a.order - b.order : -1 : b.ordered ? 1 : 0;
};

export const assignPictureOrders = (pictures: FirebasePicture[]) => {
  pictures.forEach((picture, index) => {
    picture.ordered = true;
    picture.order = index + 1;
  });
};

@Injectable()
export class FirebaseService {

  private _initialized = false;

  private _sectionsChange$: BehaviorSubject<DocumentChangeAction<FirebaseData>[]>
    = new BehaviorSubject<DocumentChangeAction<FirebaseData>[]>([]);
  private _calendarData$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  private _calendarData2$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  private _guestbookData$: BehaviorSubject<FirebaseGuestbook> = new BehaviorSubject<FirebaseGuestbook>(undefined);
  private _galleryData$: BehaviorSubject<FirebaseGallery> = new BehaviorSubject<FirebaseGallery>(undefined);

  constructor(private _afs: AngularFirestore, private _pictureService: PictureService) {
  }

  init() {
    if (this._initialized) {
      console.error('firebase service already initialized');
      return;
    }
    this._initialized = true;
    this._afs.collection<FirebaseData>('data').snapshotChanges()
      .subscribe(data => this._sectionsChange$.next(data));
    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'calendar') as FirebaseCalendar))
      .subscribe(data => this._calendarData$.next(data));
    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'calendar2') as FirebaseCalendar))
      .subscribe(data => this._calendarData2$.next(data));
    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'guestbook') as FirebaseGuestbook))
      .subscribe(data => this._guestbookData$.next(data));
    this._sectionsChange$.pipe(
      map(actions => this.findSection(actions, 'gallery') as FirebaseGallery),
      map(data => data && data.pictures ? data : { pictures: [] }),
      tap(data => data.pictures.sort(pictureComparator)),
      tap(data => assignPictureOrders(data.pictures))
    )
      .subscribe(data => this._galleryData$.next(data));
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

  createPicture(picture: FirebasePicture): Observable<void> {
    const galleryToSave = cloneDeep(this._galleryData$.value);
    if (!galleryToSave.pictures) {
      galleryToSave.pictures = [];
    }
    galleryToSave.pictures.push(picture);
    return fromPromise(
      this._afs.collection('data').doc<FirebaseGallery>(`gallery`)
        .set(galleryToSave)
    );
  }

  updateGallery(updatedGallery: FirebaseGallery): Observable<void> {
    const updatedLargeRefs = updatedGallery.pictures.map(picture => picture.large.ref);
    this.galleryData.pictures
      .filter(picture => !updatedLargeRefs.includes(picture.large.ref))
      .forEach(picture => {
        this._pictureService.deletePicture(picture);
      });
    return fromPromise(
      this._afs.collection('data').doc<FirebaseGallery>(`gallery`)
        .set(updatedGallery)
    );
  }

  get calendarData$(): Observable<FirebaseCalendar> {
    return this._calendarData$.asObservable();
  }

  get calendarData2$(): Observable<FirebaseCalendar> {
    return this._calendarData2$.asObservable();
  }

  get guestbookData$(): Observable<FirebaseGuestbook> {
    return this._guestbookData$.asObservable();
  }

  get galleryData$(): Observable<FirebaseGallery> {
    return this._galleryData$.asObservable();
  }

  get galleryData(): FirebaseGallery {
    return this._galleryData$.getValue();
  }

  private findSection(actions: DocumentChangeAction<FirebaseData>[], sectionName: string) {
    const foundSectionAction = actions.find(action => action.payload.doc.id === sectionName);
    if (!foundSectionAction) {
      return null;
    }
    return foundSectionAction.payload.doc.data();
  }
}
