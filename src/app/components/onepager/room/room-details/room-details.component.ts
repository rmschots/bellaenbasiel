import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Description,
  DescriptionStrategy,
  Image,
  LineLayout,
  PlainGalleryConfig,
  PlainGalleryStrategy
} from '@ks89/angular-modal-gallery';
import { map, Observable, ReplaySubject, switchMap, take } from 'rxjs';
import { RoomConfig } from '../../../../shared/models/room-config';
import { PictureService } from '../../../../shared/services/picture.service';

@UntilDestroy()
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailsComponent {

  galleryConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new LineLayout({width: '80px', height: '80px'}, {length: 2, wrap: true}, 'flex-start')
  };

  galleryDescriptionConfig: Description = {
    strategy: DescriptionStrategy.ALWAYS_HIDDEN
  };

  private _selectedImage$: ReplaySubject<Image> = new ReplaySubject<Image>(1);
  private _roomConfig$: ReplaySubject<RoomConfig> = new ReplaySubject<RoomConfig>(1);

  @Input()
  set roomConfig(config: RoomConfig) {
    this._roomConfig$.next(config);
    this._selectedImage$.next(config.images[0]);
  }

  constructor(private _pictureService: PictureService) {
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
      untilDestroyed(this)
    ).subscribe(currentImageIndex => {
      this.onPreviewOpen();
      // this.galleryConfig = Object.assign({}, this.galleryConfig, {layout: new AdvancedLayout(currentImageIndex, true)});
    });
  }

  gotoPreviousImage() {
    this._roomConfig$.pipe(
      switchMap(config => {
        return this._selectedImage$.pipe(map(selectedImage => {
          let idx = this.getCurrentImageIndex(selectedImage, config.images) - 1;
          const length = config.images.length;
          idx = ((idx % length) + length) % length;
          return config.images[idx];
        }));
      }),
      take(1),
      untilDestroyed(this)
    ).subscribe(nextImage => {
      this._selectedImage$.next(nextImage);
    });
  }

  gotoNextImage() {
    this._roomConfig$.pipe(
      switchMap(config => {
        return this._selectedImage$.pipe(map(selectedImage => {
          let idx = this.getCurrentImageIndex(selectedImage, config.images) + 1;
          const length = config.images.length;
          idx = ((idx % length) + length) % length;
          return config.images[idx];
        }));
      }),
      take(1),
      untilDestroyed(this)
    ).subscribe(nextImage => {
      this._selectedImage$.next(nextImage);
    });
  }

  private getCurrentImageIndex = (image: Image, images: Image[]): number => {
    return image ? images.indexOf(image) : -1;
  };

}
