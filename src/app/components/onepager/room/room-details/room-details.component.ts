import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AdvancedLayout,
  Description,
  DescriptionStrategy,
  Image,
  PlainGalleryConfig,
  PlainGalleryStrategy
} from '@ks89/angular-modal-gallery';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { PictureService } from '../../../../shared/services/picture.service';
import { RoomConfig } from '../../../../shared/models/room-config';
import { map, take, takeUntil } from 'rxjs/operators';
import { Unsubscribable } from '../../../../shared/util/unsubscribable';

@Component({
  selector: 'bnb-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailsComponent extends Unsubscribable {

  galleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };

  galleryDescriptionConfig: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN
  };

  private _selectedImage$: BehaviorSubject<Image> = new BehaviorSubject<Image>(undefined);
  private _roomConfig$: ReplaySubject<RoomConfig> = new ReplaySubject<RoomConfig>(1);

  @Input()
  set roomConfig(config: RoomConfig) {
    this._roomConfig$.next(config);
    this._selectedImage$.next(config.images[0]);
  }

  constructor(private _pictureService: PictureService) {
    super();
  }

  get roomConfig$(): Observable<RoomConfig> {
    return this._roomConfig$.asObservable();
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
    this._roomConfig$.pipe(
      map(config => {
        return this.getCurrentImageIndex(image, config.images);
      }),
      take(1),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(currentImageIndex => {
      this.onPreviewOpen();
      this.galleryConfig = Object.assign({}, this.galleryConfig, {layout: new AdvancedLayout(currentImageIndex, true)});
    });
  }

  gotoPreviousImage() {
    this._roomConfig$.pipe(
      map(config => {
        let idx = this.getCurrentImageIndex(this._selectedImage$.value, config.images) - 1;
        const length = config.images.length;
        idx = ((idx % length) + length) % length;
        return config.images[idx];
      }),
      take(1),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(nextImage => {
      this._selectedImage$.next(nextImage);
    });
  }

  gotoNextImage() {
    this._roomConfig$.pipe(
      map(config => {
        let idx = this.getCurrentImageIndex(this._selectedImage$.value, config.images) + 1;
        const length = config.images.length;
        idx = ((idx % length) + length) % length;
        return config.images[idx];
      }),
      take(1),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(nextImage => {
      this._selectedImage$.next(nextImage);
    });
  }

  private getCurrentImageIndex = (image: Image, images: Image[]): number => {
    return image ? images.indexOf(image) : -1;
  };

}
