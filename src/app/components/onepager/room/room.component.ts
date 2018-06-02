import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PictureService } from '../../../shared/services/picture.service';
import {
  AdvancedLayout,
  Description, DescriptionStrategy,
  GalleryService,
  Image,
  PlainGalleryConfig,
  PlainGalleryStrategy
} from 'angular-modal-gallery';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  galleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };

  galleryDescriptionConfig: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN
  };

  private _selectedImage$: BehaviorSubject<Image> = new BehaviorSubject<Image>(this.images[0]);

  constructor(private _pictureService: PictureService) {
  }

  get selectedImage$() {
    return this._selectedImage$.asObservable();
  }

  get extraInfo(): any[] {
    return Array(6);
  }

  get bookings(): any[] {
    return Array(3);
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
  }

  gotoNextImage() {
    let idx = this.getCurrentImageIndex(this._selectedImage$.value, this.images) + 1;
    const length = this.images.length;
    idx = ((idx % length) + length) % length;
    this._selectedImage$.next(this.images[idx]);
  }

  private getCurrentImageIndex = (image: Image, images: Image[]): number => {
    return image ? images.indexOf(image) : -1;
  }
}
