import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AdvancedLayout,
  Description,
  DescriptionStrategy,
  Image,
  PlainGalleryConfig,
  PlainGalleryStrategy
} from 'angular-modal-gallery';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PictureService } from '../../../../shared/services/picture.service';

@Component({
  selector: 'bnb-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailsComponent {

  galleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };

  galleryDescriptionConfig: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN
  };

  @Input()
  roomId: string;

  private _images: Image[] = [];
  private _selectedImage$: BehaviorSubject<Image> = new BehaviorSubject<Image>(undefined);

  constructor(private _pictureService: PictureService) {
  }

  @Input()
  set images(images: Image[]) {
    this._images = images;
    this._selectedImage$.next(images[0]);
  }

  get images(): Image[] {
    return this._images;
  }

  get selectedImage$() {
    return this._selectedImage$.asObservable();
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
