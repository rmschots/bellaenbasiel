import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { assignPictureOrders, FirebaseService } from '../../../shared/services/firebase.service';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { FirebaseGallery, FirebasePicture } from '../../../shared/models/firebase-data';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bnb-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureListComponent extends Unsubscribable implements OnInit {

  private _pictures$: BehaviorSubject<FirebasePicture[]> = new BehaviorSubject<FirebasePicture[]>([]);
  private _selectedPicture$: BehaviorSubject<FirebasePicture> = new BehaviorSubject<FirebasePicture>(undefined);

  constructor(private _firebaseService: FirebaseService, private _snackBar: MatSnackBar) {
    super();
  }

  get pictures$(): Observable<FirebasePicture[]> {
    return this._pictures$.asObservable();
  }

  get selectedPicture$(): Observable<FirebasePicture> {
    return this._selectedPicture$.asObservable();
  }

  get preventClickMoveLeft() {
    return this._selectedPicture$.getValue().order === 1;
  }

  get preventClickMoveRight() {
    return this._selectedPicture$.getValue().order === this._pictures$.getValue().length;
  }

  ngOnInit() {
    this._firebaseService.galleryData$.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((gallery: FirebaseGallery) => {
        const firebasePictures = cloneDeep(gallery.pictures);
        this._pictures$.next(firebasePictures);
        this._selectedPicture$.next(firebasePictures.length ? firebasePictures[0] : undefined);
      });
  }

  selectPicture(picture: FirebasePicture) {
    this._selectedPicture$.next(picture);
  }

  moveLeft() {
    const indexOfPrevious = this._selectedPicture$.value.order - 2;
    const pictures = this._pictures$.value;
    pictures[indexOfPrevious + 1] = pictures[indexOfPrevious];
    pictures[indexOfPrevious] = this._selectedPicture$.value;
    pictures[indexOfPrevious + 1].order = indexOfPrevious + 2;
    pictures[indexOfPrevious].order = indexOfPrevious + 1;
    this._pictures$.next(this._pictures$.value);
  }

  moveRight() {
    const indexOfNext = this._selectedPicture$.value.order;
    const pictures = this._pictures$.value;
    pictures[indexOfNext - 1] = pictures[indexOfNext];
    pictures[indexOfNext] = this._selectedPicture$.value;
    pictures[indexOfNext - 1].order = indexOfNext;
    pictures[indexOfNext].order = indexOfNext + 1;
    this._pictures$.next(this._pictures$.value);
  }

  deleteSelected() {
    let pictures = cloneDeep(this._pictures$.getValue());
    pictures = pictures.filter(picture => picture.large.ref !== this._selectedPicture$.getValue().large.ref);
    assignPictureOrders(pictures);
    this._pictures$.next(pictures);
    if (pictures.length >= this._selectedPicture$.value.order) {
      this._selectedPicture$.next(pictures[this._selectedPicture$.value.order - 1]);
    } else {
      if (pictures.length > 0) {
        this._selectedPicture$.next(pictures[this._selectedPicture$.value.order - 2]);
      } else {
        this._selectedPicture$.next(undefined);
      }
    }
  }

  saveChanges() {
    this._firebaseService.updateGallery({ pictures: this._pictures$.value })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        () => {
          console.log('update success');
          this._snackBar.open('Foto\'s updaten voltooid', null, {
            duration: 5000
          });
        },
        error => {
          console.error('error updating guestbook', error);
          this._snackBar.open('Geen rechten om foto\'s te wijzigen', null, {
            duration: 5000
          });
        }
      );
  }
}
