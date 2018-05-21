import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { PictureService } from '../../../shared/services/picture.service';
import { FirebaseService } from '../../../shared/services/firebase.service';

const galleryOptions: NgxGalleryOptions[] = [
  {
    width: '800px',
    height: '600px',
    thumbnailsColumns: 8,
    imageAnimation: NgxGalleryAnimation.Fade,
    previewCloseOnClick: true,
    previewCloseOnEsc: true,
    previewFullscreen: true,
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

@Component({
  selector: 'bnb-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss']
})
export class PicturesComponent extends Unsubscribable {

  galleryOptions: NgxGalleryOptions[] = galleryOptions;
  galleryImages: NgxGalleryImage[] = [];


  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _pictureService: PictureService,
              private _firebaseService: FirebaseService) {
    super();
    _firebaseService.galleryData$
      .takeUntil(this.ngUnsubscribe$)
      .filter(data => !!data)
      .subscribe(gallery => {
        this.galleryImages = gallery.pictures.map(picture => ({
          small: picture.small.url,
          medium: picture.medium.url,
          big: picture.large.url
        }));
      });
  }

  onPreviewOpen() {
    this._pictureService.overlayShown = true;
  }

  onPreviewClose() {
    this._pictureService.overlayShown = false;
  }
}
