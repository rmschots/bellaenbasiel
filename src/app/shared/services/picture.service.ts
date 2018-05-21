import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AngularFireStorage } from 'angularfire2/storage';
import { Ng2PicaService } from 'ng2-pica';
import { v4 as uuid } from 'uuid';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FirebasePicture } from '../models/firebase-data';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class PictureService {

  private _overlayShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _storage: AngularFireStorage, private _ng2PicaService: Ng2PicaService) {
  }

  set overlayShown(shown: boolean) {
    this._overlayShown.next(shown);
  }

  get overlayShown$(): Observable<boolean> {
    return this._overlayShown.asObservable();
  }

  init() {
    const storageRef = this._storage.storage.ref();
    const picturesRef = storageRef.child('pictures');
    console.log(picturesRef);

  }

  resizeImageForThumbnail(files: File[]): Observable<any> {
    return this._ng2PicaService.resize(files, 100, 100, true);
  }

  resizeImageForShowcase(files: File[]): Observable<any> {
    return this._ng2PicaService.resize(files, 2000, 510, true);
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
    return forkJoin(referenceSmall.delete(), referenceMedium.delete(), referenceLarge.delete());
  }
}
