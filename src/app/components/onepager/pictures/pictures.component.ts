import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { PictureService } from '../../../shared/services/picture.service';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { isEqual } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  AdvancedLayout,
  Description,
  DescriptionStrategy,
  Image,
  PlainGalleryConfig,
  PlainGalleryStrategy
} from 'angular-modal-gallery';
import { ImageData, ModalImage, PlainImage } from 'angular-modal-gallery/src/model/image.class';
import { PageScrollInstance, PageScrollService } from 'ngx-page-scroll';
import { DOCUMENT } from '@angular/common';

export class CustomImage extends Image {
  showcase: ImageData;

  constructor(id: number, modal: ModalImage, plain?: PlainImage, showcase?: ImageData) {
    super(id, modal, plain);
    this.showcase = showcase;
  }
}

@Component({
  selector: 'bnb-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicturesComponent extends Unsubscribable {

  @ViewChild('scrollContainer') scrollContainer;

  images: CustomImage[] = [];

  galleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };

  galleryDescriptionConfig: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN
  };

  private _isChangingImage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _selectedImage$: BehaviorSubject<CustomImage> = new BehaviorSubject<CustomImage>(undefined);


  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _pictureService: PictureService,
              private _firebaseService: FirebaseService,
              private _pageScrollService: PageScrollService,
              @Inject(DOCUMENT) private _document: any) {
    super();
    _firebaseService.galleryData$
      .takeUntil(this.ngUnsubscribe$)
      .filter(data => !!data)
      .map(gallery => gallery.pictures.map(picture =>
        new CustomImage(picture.order, {
          img: picture.large.url
        }, {
          img: picture.small.url
        }, {
          img: picture.medium.url
        })))
      .distinctUntilChanged((data1, data2) => isEqual(data1, data2))
      .subscribe(imgs => {
        this.images = imgs;
        if (imgs.length) {
          this._selectedImage$.next(this.images[0]);
        }
      });
  }

  get selectedImage$() {
    return this._selectedImage$.asObservable();
  }

  get isChangingImage$() {
    return this._isChangingImage$.asObservable();
  }

  onPreviewOpen() {
    this._pictureService.overlayShown = true;
  }

  onPreviewClose() {
    this._pictureService.overlayShown = false;
  }

  openImageModal(image: Image) {
    this.onPreviewOpen();
    const index: number = this.getCurrentImageIndex(image, this.images);
    this.galleryConfig = Object.assign({}, this.galleryConfig, {layout: new AdvancedLayout(index, true)});
  }

  gotoPreviousImage() {
    let idx = this.getCurrentImageIndex(this._selectedImage$.value, this.images) - 1;
    const length = this.images.length;
    idx = ((idx % length) + length) % length;
    this._selectedImage$.next(this.images[idx]);
    this.scrollToImage();
    this.refreshImage();
  }

  gotoNextImage() {
    let idx = this.getCurrentImageIndex(this._selectedImage$.value, this.images) + 1;
    const length = this.images.length;
    idx = ((idx % length) + length) % length;
    this._selectedImage$.next(this.images[idx]);
    this.scrollToImage();
    this.refreshImage();
  }

  selectImage(img: CustomImage) {
    if (img !== this._selectedImage$.value) {
      this._selectedImage$.next(img);
      this.scrollToImage();
      this.refreshImage();
    }
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy(-200, 0);
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy(200, 0);
  }

  scrollToImage(): void {
    const img = this._document.getElementById(`picture${this._selectedImage$.value.id}`);
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this._document,
      scrollTarget: `#picture${this._selectedImage$.value.id}`,
      verticalScrolling: false,
      scrollingViews: [this.scrollContainer.nativeElement],
      pageScrollDuration: 0,
      pageScrollOffset: this.scrollContainer.nativeElement.clientWidth / 2 - img.clientWidth / 2
    });
    this._pageScrollService.start(pageScrollInstance);
  }

  private getCurrentImageIndex = (image: Image, images: Image[]): number => {
    return image ? images.indexOf(image) : -1;
  }

  private refreshImage() {
    this._isChangingImage$.next(true);
    setTimeout(() => this._isChangingImage$.next(false), 1);
  }
}
