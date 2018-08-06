import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Image } from 'angular-modal-gallery';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { isEqual } from 'lodash';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { FirebaseCalendar } from '../../../shared/models/firebase-data';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnb-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent extends Unsubscribable {
  images: Image[] = [
    new Image(1, {
      img: '/assets/img/room_img1.jpg',
      description: 'ROOM.room1.image1'
    }, {img: '/assets/img/room_img1.jpg'}),
    new Image(2, {
      img: '/assets/img/room_img2.jpg',
      description: 'ROOM.room1.image2'
    }, {img: '/assets/img/room_img2.jpg'}),
    new Image(3, {
      img: '/assets/img/room_img3.jpg',
      description: 'ROOM.room1.image3'
    }, {img: '/assets/img/room_img3.jpg'})
  ];

  images2: Image[] = [
    new Image(4, {
      img: '/assets/img/room_img1.jpg',
      description: 'ROOM.room1.image1'
    }, {img: '/assets/img/room_img1.jpg'}),
    new Image(5, {
      img: '/assets/img/room_img2.jpg',
      description: 'ROOM.room1.image2'
    }, {img: '/assets/img/room_img2.jpg'}),
    new Image(6, {
      img: '/assets/img/room_img3.jpg',
      description: 'ROOM.room1.image3'
    }, {img: '/assets/img/room_img3.jpg'})
  ];

  private _firebaseCalendar1$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  private _firebaseCalendar2$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  constructor(private _firebaseService: FirebaseService) {
    super();
    this._firebaseService.calendarData$.takeUntil(this.ngUnsubscribe$)
      .filter(value => !!value)
      .distinctUntilChanged((data1, data2) => isEqual(data1, data2))
      .subscribe(data => this._firebaseCalendar1$.next(data));
    this._firebaseService.calendarData2$.takeUntil(this.ngUnsubscribe$)
      .filter(value => !!value)
      .distinctUntilChanged((data1, data2) => isEqual(data1, data2))
      .subscribe(data => this._firebaseCalendar2$.next(data));
  }

  get firebaseCalendar1$(): BehaviorSubject<FirebaseCalendar> {
    return this._firebaseCalendar1$;
  }
  get firebaseCalendar2$(): BehaviorSubject<FirebaseCalendar> {
    return this._firebaseCalendar2$;
  }


  get extraInfo(): any[] {
    return Array(6);
  }

  get bookings(): any[] {
    return Array(3);
  }
}
