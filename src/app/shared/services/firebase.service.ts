import { inject, Injectable } from '@angular/core';
import { FirebaseCalendar, FirebaseGallery, FirebaseGuestbook, FirebasePicture } from '../models/firebase-data';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { PictureService } from './picture.service';
import { collection, DocumentChange, DocumentData, Firestore, onSnapshot } from '@angular/fire/firestore';

export const pictureComparator = (a: any, b: any) => {
  return a.ordered ? b.ordered ? a.order - b.order : -1 : b.ordered ? 1 : 0;
};

export const assignPictureOrders = (pictures: FirebasePicture[]) => {
  pictures.forEach((picture, index) => {
    picture.ordered = true;
    picture.order = index + 1;
  });
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly _afs: Firestore = inject(Firestore);

  private _initialized = false;

  private _sectionsChange$: BehaviorSubject<DocumentChange<DocumentData>[]>
    = new BehaviorSubject<DocumentChange<DocumentData>[]>([]);
  private _calendarData$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);
  private _calendarData2$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);
  private _guestbookData$: ReplaySubject<FirebaseGuestbook> = new ReplaySubject<FirebaseGuestbook>(1);

  private _galleryData$: ReplaySubject<FirebaseGallery> = new ReplaySubject<FirebaseGallery>(1);

  constructor(private _pictureService: PictureService) {
  }

  init() {
    if (this._initialized) {
      console.error('firebase service already initialized');
      return;
    }
    this._initialized = true;
    onSnapshot(collection(this._afs, 'data'), {
      next: snapshot => {
        this._sectionsChange$.next(snapshot.docChanges());
      }
    });

    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'calendar') as FirebaseCalendar))
      .subscribe(data => this._calendarData$.next(data));
    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'calendar2') as FirebaseCalendar))
      .subscribe(data => this._calendarData2$.next(data));
    this._sectionsChange$.pipe(map(actions => this.findSection(actions, 'guestbook') as FirebaseGuestbook))
      .subscribe(data => this._guestbookData$.next(data));
    this._sectionsChange$.pipe(
      map(actions => this.findSection(actions, 'gallery') as FirebaseGallery),
      map(data => data?.pictures ? data : {pictures: []}),
      tap(data => data.pictures.sort(pictureComparator)),
      tap(data => assignPictureOrders(data.pictures))
    )
      .subscribe(data => {
        console.log(data);
        this._galleryData$.next(data);
      });
  }

  // updateFirebaseGuestbook(updatedGuestbook: FirebaseGuestbook): Observable<void> {
  //   let guestbookToSave: FirebaseGuestbook;
  //   return this._guestbookData$.pipe(switchMap(value => {
  //     if (value) {
  //       guestbookToSave = cloneDeep(value);
  //       guestbookToSave.metadata = updatedGuestbook.metadata;
  //       const newReviewIds = updatedGuestbook.reviews.map(review => review.id);
  //       guestbookToSave.reviews = guestbookToSave.reviews.filter(oldReview => {
  //         return !newReviewIds.includes(oldReview.id);
  //       });
  //       updatedGuestbook.reviews.forEach(review => guestbookToSave.reviews.push(review));
  //     } else {
  //       guestbookToSave = updatedGuestbook;
  //     }
  //     return from(
  //       this._afs.collection('data').doc<FirebaseGuestbook>(`guestbook`)
  //         .set(guestbookToSave)
  //     );
  //   }));
  // }
  //
  // createPicture(picture: FirebasePicture): Observable<void> {
  //   return this._galleryData$.pipe(switchMap(value => {
  //     const galleryToSave = cloneDeep(value);
  //     if (!galleryToSave.pictures) {
  //       galleryToSave.pictures = [];
  //     }
  //     galleryToSave.pictures.push(picture);
  //     return from(
  //       this._afs.collection('data').doc<FirebaseGallery>(`gallery`)
  //         .set(galleryToSave)
  //     );
  //   }));
  // }
  //
  // updateGallery(updatedGallery: FirebaseGallery): Observable<void> {
  //   const updatedLargeRefs = updatedGallery.pictures.map(picture => picture.large.ref);
  //   return this._galleryData$.pipe(switchMap(value => {
  //     value.pictures
  //       .filter(picture => !updatedLargeRefs.includes(picture.large.ref))
  //       .forEach(picture => {
  //         this._pictureService.deletePicture(picture);
  //       });
  //     return from(
  //       this._afs.collection('data').doc<FirebaseGallery>(`gallery`)
  //         .set(updatedGallery)
  //     );
  //   }));
  // }
  //
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

  private findSection(actions: DocumentChange[], sectionName: string) {
    const foundSectionAction = actions.find(action => action.doc.id === sectionName);
    if (!foundSectionAction) {
      return null;
    }
    return foundSectionAction.doc.data();
  }
}
