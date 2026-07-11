import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, ReplaySubject } from 'rxjs';
import { FirebaseCalendar } from '../../../shared/models/firebase-data';
import { RoomConfig } from '../../../shared/models/room-config';
import { TranslationService } from '../../../shared/services/translation.service';
import { isEqual } from 'lodash-es';

export const BOOKING_EMAIL = 'bellaenbasiel@telenet.be';

@UntilDestroy()
@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RoomComponent {
  readonly maxMonthOffset = 11;
  readonly bookingEmail = BOOKING_EMAIL;

  rooms: RoomConfig[] = [
    {
      id: 1,
      price: 114,
      images: [
        {src: '/assets/img/rooms/room1/bedroom.jpg', captionKey: 'ROOM.rooms.room1.image1'},
        {src: '/assets/img/rooms/room1/bathroom.jpg', captionKey: 'ROOM.rooms.room1.image2'},
        {src: '/assets/img/rooms/room1/breakfast.jpg', captionKey: 'ROOM.rooms.room1.image3'}
      ],
      tags: [
        {key: 'ROOM.tags.persons', params: {amount: '2'}},
        {key: 'ROOM.tags.wifi'},
        {key: 'ROOM.tags.tv'},
        {key: 'ROOM.tags.breakfastOptional'}
      ]
    },
    {
      id: 2,
      price: 125,
      images: [
        {src: '/assets/img/rooms/room2/bedroom.jpg', captionKey: 'ROOM.rooms.room2.image1'},
        {src: '/assets/img/rooms/room2/bathroom.jpg', captionKey: 'ROOM.rooms.room2.image2'},
        {src: '/assets/img/rooms/room2/breakfast.jpg', captionKey: 'ROOM.rooms.room2.image3'}
      ],
      tags: [
        {key: 'ROOM.tags.persons', params: {amount: '2–3'}},
        {key: 'ROOM.tags.wifi'},
        {key: 'ROOM.tags.tv'},
        {key: 'ROOM.tags.sofaBed'}
      ]
    },
    {
      id: 3,
      price: 104,
      images: [
        {src: '/assets/img/rooms/room3/bedroom.jpg', captionKey: 'ROOM.rooms.room3.image1'},
        {src: '/assets/img/rooms/room3/bathroom.jpg', captionKey: 'ROOM.rooms.room3.image2'},
        {src: '/assets/img/rooms/room3/breakfast.jpg', captionKey: 'ROOM.rooms.room3.image3'}
      ],
      tags: [
        {key: 'ROOM.tags.persons', params: {amount: '2'}},
        {key: 'ROOM.tags.wifi'},
        {key: 'ROOM.tags.tv'},
        {key: 'ROOM.tags.breakfastOptional'}
      ]
    }
  ];

  photoIndex: Record<number, number> = {1: 0, 2: 0, 3: 0};
  copied = false;

  private _copyTimeout?: ReturnType<typeof setTimeout>;
  private _monthOffset$ = new BehaviorSubject<number>(0);
  private _firebaseCalendar1$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);
  private _firebaseCalendar2$: ReplaySubject<FirebaseCalendar> = new ReplaySubject<FirebaseCalendar>(1);

  constructor(private _firebaseService: FirebaseService,
              private _translationService: TranslationService,
              private _cd: ChangeDetectorRef) {
    this._firebaseService.calendarData$.pipe(untilDestroyed(this),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this._firebaseCalendar1$.next(data));
    this._firebaseService.calendarData2$.pipe(untilDestroyed(this),
      filter(value => !!value),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this._firebaseCalendar2$.next(data));
  }

  get firebaseCalendar1$(): Observable<FirebaseCalendar> {
    return this._firebaseCalendar1$.asObservable();
  }

  get firebaseCalendar2$(): Observable<FirebaseCalendar> {
    return this._firebaseCalendar2$.asObservable();
  }

  get monthOffset$(): Observable<number> {
    return this._monthOffset$.asObservable();
  }

  get calendarLabel$(): Observable<string> {
    return combineLatest([this._translationService.currentLanguage$, this._monthOffset$]).pipe(
      map(([language, offset]) => {
        const now = new Date();
        const viewDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return viewDate.toLocaleDateString(language.code, {month: 'long', year: 'numeric'});
      })
    );
  }

  prevPhoto(roomId: number): void {
    this.movePhoto(roomId, -1);
  }

  nextPhoto(roomId: number): void {
    this.movePhoto(roomId, 1);
  }

  pickPhoto(roomId: number, index: number): void {
    this.photoIndex = {...this.photoIndex, [roomId]: index};
  }

  previousMonth(): void {
    this._monthOffset$.next(Math.max(0, this._monthOffset$.getValue() - 1));
  }

  nextMonth(): void {
    this._monthOffset$.next(Math.min(this.maxMonthOffset, this._monthOffset$.getValue() + 1));
  }

  copyEmail(): void {
    const done = () => {
      this.copied = true;
      this._cd.markForCheck();
      clearTimeout(this._copyTimeout);
      this._copyTimeout = setTimeout(() => {
        this.copied = false;
        this._cd.markForCheck();
      }, 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(this.bookingEmail).then(done, done);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = this.bookingEmail;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        // ignore: the address stays visible so the user can copy it manually
      }
      document.body.removeChild(textarea);
      done();
    }
  }

  private movePhoto(roomId: number, offset: number): void {
    const amountOfPhotos = this.rooms.find(room => room.id === roomId)!.images.length;
    const next = ((this.photoIndex[roomId] + offset) % amountOfPhotos + amountOfPhotos) % amountOfPhotos;
    this.pickPhoto(roomId, next);
  }
}
