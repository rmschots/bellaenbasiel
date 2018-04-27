import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';

const galleryOptions: NgxGalleryOptions[] = [
  {
    width: '100%',
    height: '390px',
    imageAnimation: NgxGalleryAnimation.Fade,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    closeIcon: '',
    imageSize: 'cover',
    thumbnails: false,
    imageArrowsAutoHide: true
  },
  // max-width 600
  {
    breakpoint: 600,
    width: '100%',
    height: '300px',
  },
  {
    breakpoint: 400,
    preview: false
  }
];

const galleryImages: NgxGalleryImage[] = [
  {
    medium: '/assets/img/room_img1.jpg',
    big: '/assets/img/room_img1.jpg'
  }, {
    medium: '/assets/img/room_img2.jpg',
    big: '/assets/img/room_img2.jpg'
  }, {
    medium: '/assets/img/room_img3.jpg',
    big: '/assets/img/room_img3.jpg'
  }
];

@Component({
  selector: 'bnb-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  galleryImages: NgxGalleryImage[] = galleryImages;

  get extraInfo(): any[] {
    return Array(6);
  }

  get bookings(): any[] {
    return Array(3);
  }
}
