import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';

const galleryOptions: NgxGalleryOptions[] = [
  {
    width: '800px',
    height: '600px',
    thumbnailsColumns: 8,
    imageAnimation: NgxGalleryAnimation.Fade,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    arrowPrevIcon: 'material-icon material-icon-navigate-before',
    arrowNextIcon: 'material-icon material-icon-navigate-next',
    imageSize: 'contain',
    thumbnailsPercent: 15,
    imagePercent: 85,
    thumbnailsMargin: 4,
    thumbnailMargin: 1
  },
  // max-width 800
  {
    breakpoint: 800,
    width: '100%',
    height: '600px',
    imagePercent: 80,
    thumbnailsPercent: 20,
    thumbnailsMargin: 4,
    thumbnailMargin: 0
  },
  // max-width 400
  {
    breakpoint: 400,
    preview: false
  }
];

const galleryImages: NgxGalleryImage[] = [
  {
    small: '/assets/img/gallery/brugge1-small.jpg',
    medium: '/assets/img/gallery/brugge1-medium.jpg',
    big: '/assets/img/gallery/brugge1.jpg'
  }, {
    small: '/assets/img/gallery/brugge2-small.jpg',
    medium: '/assets/img/gallery/brugge2-medium.jpg',
    big: '/assets/img/gallery/brugge2.jpg'
  }
];

@Component({
  selector: 'bnb-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicturesComponent {
  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  galleryImages: NgxGalleryImage[] = galleryImages;
}
