import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { DOCUMENT } from '@angular/common';
import { isEqual } from 'lodash';
import { LightGallerySettings } from 'lightgallery/lg-settings';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import { GalleryItem } from 'lightgallery/lg-utils';

@UntilDestroy()
@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicturesComponent {
  private lightGallery!: LightGallery;
  items$: BehaviorSubject<GalleryItem[]> = new BehaviorSubject<GalleryItem[]>([{
    src: 'assets/svg/loading-image.svg',
    thumb: 'assets/svg/loading-image.svg'
  }])
  settings: LightGallerySettings = {
    plugins: [lgZoom, lgThumbnail],
    dynamic: true,
    closable: false,
    showMaximizeIcon: true,
    container: this._elementRef.nativeElement,
    dynamicEl: this.items$.getValue()
  };


  onInit = (detail: InitDetail) => {
    this.lightGallery = detail.instance;
  };

  constructor(private _changeDetectorRef: ChangeDetectorRef,
              _firebaseService: FirebaseService,
              private _elementRef: ElementRef,
              @Inject(DOCUMENT) private _document: any) {
    _firebaseService.galleryData$.pipe(
      filter(data => !!data),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)),
      untilDestroyed(this)
    )
      .subscribe(imgs => {
        const gas: GalleryItem[] = imgs.pictures.map(picture => {
          return {
            src: picture.large.url,
            thumb: picture.small.url,
          }
        });
        this.items$.next(gas);
        if (this.lightGallery) {
          this.lightGallery.refresh(gas);
          this.lightGallery.openGallery();
          this._changeDetectorRef.detectChanges();
        }
      });
  }
}
