import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { distinctUntilChanged, filter, ReplaySubject } from 'rxjs';
import { FirebaseCalendar } from '../../../shared/models/firebase-data';
import { RoomConfig } from '../../../shared/models/room-config';
import { Image } from '@ks89/angular-modal-gallery';
import { isEqual } from 'lodash';

@UntilDestroy()
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  roomConfig1: RoomConfig = {
    id: 1,
    price: 90,
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
        img: '/assets/img/rooms/room1/breakfast.jpg',
        description: 'ROOM.rooms.room1.image3'
      }, {img: '/assets/img/rooms/room1/breakfast.jpg'})
    ]
  };
  roomConfig2: RoomConfig = {
    id: 2,
    price: 95,
    images: [
      new Image(4, {
        img: '/assets/img/rooms/room2/bedroom.jpg',
        description: 'ROOM.rooms.room2.image1'
      }, {img: '/assets/img/rooms/room2/bedroom.jpg'}),
      new Image(5, {
        img: '/assets/img/rooms/bathroom.jpg',
        description: 'ROOM.rooms.room2.image2'
      }, {img: '/assets/img/rooms/room2/bathroom.jpg'}),
      new Image(6, {
        img: '/assets/img/rooms/breakfast.jpg',
        description: 'ROOM.rooms.room2.image3'
      }, {img: '/assets/img/rooms/room2/breakfast.jpg'})
    ]
  };
  roomConfig3: RoomConfig = {
    id: 3,
    price: 85,
    images: [
      new Image(7, {
        img: '/assets/img/rooms/room3/bedroom.jpg',
        description: 'ROOM.rooms.room3.image1'
      }, {img: '/assets/img/rooms/room3/bedroom.jpg'}),
      new Image(8, {
        img: '/assets/img/rooms/room3/bathroom.jpg',
        description: 'ROOM.rooms.room3.image2'
      }, {img: '/assets/img/rooms/room3/bathroom.jpg'}),
      new Image(9, {
        img: '/assets/img/rooms/room3/breakfast.jpg',
        description: 'ROOM.rooms.room3.image3'
      }, {img: '/assets/img/rooms/room3/breakfast.jpg'})
    ]
  };

  private _firebaseCalendar1$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);
  private _firebaseCalendar2$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);

  constructor(private _firebaseService: FirebaseService) {
    this._firebaseService.calendarData$.pipe(untilDestroyed(this),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this._firebaseCalendar1$.next(data));
    this._firebaseService.calendarData2$.pipe(untilDestroyed(this),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this._firebaseCalendar2$.next(data));
  }

  get firebaseCalendar1$(): ReplaySubject<FirebaseCalendar> {
    return this._firebaseCalendar1$;
  }

  get firebaseCalendar2$(): ReplaySubject<FirebaseCalendar> {
    return this._firebaseCalendar2$;
  }


  get extraInfo(): any[] {
    return Array(6);
  }

  get bookings(): any[] {
    return Array(3);
  }
}
