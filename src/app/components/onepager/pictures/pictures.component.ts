import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { PictureService } from '../../../shared/services/picture.service';

const galleryOptions: NgxGalleryOptions[] = [
  {
    width: '800px',
    height: '600px',
    thumbnailsColumns: 8,
    imageAnimation: NgxGalleryAnimation.Fade,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    previewFullscreen : true,
    imageSize: 'contain',
    thumbnailsPercent: 15,
    imagePercent: 85,
    thumbnailsMargin: 4,
    thumbnailMargin: 2,
    imageSwipe: true,
    thumbnailsSwipe: true,
    imageInfinityMove: true,
    thumbnailsArrowsAutoHide: true,
    previewSwipe: true,
    previewAnimation: false
  },
  // max-width 800
  {
    breakpoint: 800,
    width: '100%',
    height: '600px',
    thumbnailsColumns: 6,
    imagePercent: 80,
    thumbnailsPercent: 20,
    thumbnailsMargin: 4,
    thumbnailMargin: 0,
    previewAnimation: true
  },
  // max-width 400
  {
    breakpoint: 400,
    thumbnailsColumns: 4,
    preview: false
  }
];

const AMOUNT_OF_IMAGES = 31;

@Component({
  selector: 'bnb-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent extends Unsubscribable {

  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  galleryImages: NgxGalleryImage[] = PicturesComponent.images;


  constructor(private _changeDetectorRef: ChangeDetectorRef, private _pictureService: PictureService) {
    super();
  }

  onPreviewOpen() {
    this._pictureService.overlayShown = true;
  }

  onPreviewClose() {
    this._pictureService.overlayShown = false;
  }

  private static get images(): NgxGalleryImage[] {
    const images: NgxGalleryImage[] = [];
    for (let i = 1; i <= AMOUNT_OF_IMAGES; i++) {
      images.push({
        small: `/assets/img/gallery/small/brugge${i}.jpg`,
        medium: `/assets/img/gallery/medium/brugge${i}.jpg`,
        big: `/assets/img/gallery/large/brugge${i}.jpg`
      });
    }
    return images;
  }
}
