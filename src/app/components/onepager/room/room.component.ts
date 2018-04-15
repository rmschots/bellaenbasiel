import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';

const galleryOptions: NgxGalleryOptions[] = [
  {
    width: '520px',
    height: '390px',
    imageAnimation: NgxGalleryAnimation.Fade,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    arrowPrevIcon: 'material-icon material-icon-navigate-before',
    arrowNextIcon: 'material-icon material-icon-navigate-next',
    imageSize: 'contain',
    thumbnails: false,
    imageArrowsAutoHide: true
  }
];

const galleryImages: NgxGalleryImage[] = [
  {
    medium: 'assets/img/room_img1.jpg',
    big: 'assets/img/room_img1.jpg'
  }, {
    medium: 'assets/img/room_img2.jpg',
    big: 'assets/img/room_img2.jpg'
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

  extraInfoTexts: string[] = [
    '*Minimum 2 nights',
    '**You can order breakfast by mail contact',
    'Tourist tax city of Bruges = &euro;2,- pppn',
    'No pets allowed',
    'Smoking is allowed in the garden',
    'Usage of washing machine or dryer : &euro;5,-'
  ];

  bookingTexts: string[] = [
    '<b>Deposit:</b> &euro;75,- on BE47 7512 0859 2880',
    '<b>Balance:</b> cash on arrival',
    '<b>Cancelling</b> is possible without penalty up to 5 days before the arrival date.' +
    ' For later cancellation, the first night and possibly ordered breakfast is charged.' +
    ' In case of no show, the total sum of the reservation will be charged.'
  ];
}
