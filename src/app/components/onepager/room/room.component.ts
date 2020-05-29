import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Image } from '@ks89/angular-modal-gallery';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { isEqual } from 'lodash';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { FirebaseCalendar } from '../../../shared/models/firebase-data';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { RoomConfig } from '../../../shared/models/room-config';

@Component({
  selector: 'bnb-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent extends Unsubscribable {
  roomConfig1: RoomConfig = {
    id: 1,
    price: 80,
    images: [
      new Image(1, {
        img: '/assets/img/rooms/room1/bedroom.jpg',
        description: 'ROOM.rooms.room1.image1'
      }, {img: '/assets/img/rooms/room1/bedroom.jpg'}),
      new Image(2, {
        img: '/assets/img/rooms/room1/bathroom.jpg',
        description: 'ROOM.rooms.room1.image2'
      }, {img: '/assets/img/rooms/room1/bathroom.jpg'}),
      new Image(3, {
        img: '/assets/img/rooms/breakfast.jpg',
        description: 'ROOM.rooms.room1.image3'
      }, {img: '/assets/img/rooms/breakfast.jpg'})
    ]
  };
  roomConfig2: RoomConfig = {
    id: 2,
    price: 85,
    images: [
      new Image(4, {
        img: '/assets/img/rooms/room2/bedroom.jpg',
        description: 'ROOM.rooms.room2.image1'
      }, {img: '/assets/img/rooms/room2/bedroom.jpg'}),
      new Image(6, {
        img: '/assets/img/rooms/breakfast.jpg',
        description: 'ROOM.rooms.room2.image3'
      }, {img: '/assets/img/rooms/breakfast.jpg'})
    ]
  };
  roomConfig3: RoomConfig = {
    id: 3,
    price: 75,
    images: [
      new Image(7, {
        img: '/assets/img/rooms/room3/bedroom.jpg',
        description: 'ROOM.rooms.room3.image1'
      }, {img: '/assets/img/rooms/room3/bedroom.jpg'}),
      new Image(9, {
        img: '/assets/img/rooms/breakfast.jpg',
        description: 'ROOM.rooms.room3.image3'
      }, {img: '/assets/img/rooms/breakfast.jpg'})
    ]
  };

  private _firebaseCalendar1$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);
  private _firebaseCalendar2$: BehaviorSubject<FirebaseCalendar> = new BehaviorSubject<FirebaseCalendar>(undefined);

  constructor(private _firebaseService: FirebaseService) {
    super();
    this._firebaseService.calendarData$.pipe(takeUntil(this.ngUnsubscribe$),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this._firebaseCalendar1$.next(data));
    this._firebaseService.calendarData2$.pipe(takeUntil(this.ngUnsubscribe$),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
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
