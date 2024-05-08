import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { FirebasePicture } from '../models/firebase-data';
import { ref, Storage } from '@angular/fire/storage';
import { deleteObject } from '@firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private readonly _storage: Storage = inject(Storage);
  private _overlayShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(/*private _ng2PicaService: Ng2PicaService*/) {
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

  // uploadPicture(pf: File, size: string): Observable<any> {
  //   const parts = pf.name.split('.');
  //   const reference = ref(this._storage, `pictures/${size}`);
  //   const imageSmallRef = reference.child(`${uuid()}.${parts[parts.length - 1]}`);
  //   return from(imageSmallRef.put(pf));
  // }

  deletePicture(firebasePicture: FirebasePicture): Observable<[void, void, void]> {
    const referenceSmall = ref(this._storage, firebasePicture.small.ref);
    const referenceMedium = ref(this._storage, firebasePicture.medium.ref);
    const referenceLarge = ref(this._storage, firebasePicture.large.ref);
    return forkJoin([from(deleteObject(referenceSmall)), from(deleteObject(referenceMedium)), from(deleteObject(referenceLarge))]);
  }
}
