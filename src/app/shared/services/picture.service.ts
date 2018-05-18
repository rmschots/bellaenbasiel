import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PictureService {

  private _overlayShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  set overlayShown(shown: boolean) {
    this._overlayShown.next(shown);
  }

  get overlayShown$(): Observable<boolean> {
    return this._overlayShown.asObservable();
  }
}
