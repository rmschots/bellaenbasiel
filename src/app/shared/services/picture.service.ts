import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { FirebasePicture } from '../models/firebase-data';
import { fromPromise } from 'rxjs/internal-compatibility';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable()
export class PictureService {

  private _overlayShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _storage: AngularFireStorage/*, private _ng2PicaService: Ng2PicaService*/) {
  }

  set overlayShown(shown: boolean) {
    this._overlayShown.next(shown);
  }

  get overlayShown$(): Observable<boolean> {
    return this._overlayShown.asObservable();
  }

  resizeImageForThumbnail(files: File[]): Observable<any> {
    // return this._picaService.resizeImages(files, 100, 100, true);
    return of([]);
  }

  resizeImageForShowcase(files: File[]): Observable<any> {
    // return this._picaService.resizeImages(files, 2000, 510, true);
    return of([]);
  }

  uploadPicture(pf: File, size: string): Observable<any> {
    const parts = pf.name.split('.');
    const reference = this._storage.storage.ref(`pictures/${size}`);
    const imageSmallRef = reference.child(`${uuid()}.${parts[parts.length - 1]}`);
    return fromPromise(imageSmallRef.put(pf));
  }

  deletePicture(firebasePicture: FirebasePicture): Observable<[void, void, void]> {
    const referenceSmall = this._storage.storage.ref(firebasePicture.small.ref);
    const referenceMedium = this._storage.storage.ref(firebasePicture.medium.ref);
    const referenceLarge = this._storage.storage.ref(firebasePicture.large.ref);
    return forkJoin([from(referenceSmall.delete()), from(referenceMedium.delete()), from(referenceLarge.delete())]);
  }
}
