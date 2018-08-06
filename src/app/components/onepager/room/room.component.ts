import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Image } from 'angular-modal-gallery';

@Component({
  selector: 'bnb-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {

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

  get extraInfo(): any[] {
    return Array(6);
  }

  get bookings(): any[] {
    return Array(3);
  }
}
