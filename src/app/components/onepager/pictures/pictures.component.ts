import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { FirebasePicture } from '../../../shared/models/firebase-data';
import { isEqual } from 'lodash-es';

const COLLAPSED_COUNT = 8;
// Mosaic rhythm taken from the redesign mockup, repeated over the real gallery
const SPAN_PATTERN: Record<number, string> = {
  0: 'g-wide g-tall',
  5: 'g-wide',
  8: 'g-wide',
  11: 'g-tall',
  12: 'g-wide',
  14: 'g-wide',
  16: 'g-wide'
};
const SPAN_PATTERN_LENGTH = 17;

@UntilDestroy()
@Component({
    selector: 'app-pictures',
    templateUrl: './pictures.component.html',
    styleUrls: ['./pictures.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PicturesComponent {
  readonly collapsedCount = COLLAPSED_COUNT;

  expanded = false;
  lightboxIndex = -1;

  private _pictures$ = new BehaviorSubject<FirebasePicture[]>([]);

  constructor(private _firebaseService: FirebaseService) {
    this._firebaseService.galleryData$.pipe(
      filter(data => !!data),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)),
      untilDestroyed(this)
    ).subscribe(gallery => this._pictures$.next(gallery.pictures));
  }

  get pictures$(): Observable<FirebasePicture[]> {
    return this._pictures$.asObservable();
  }

  get pictureCount$(): Observable<number> {
    return this._pictures$.pipe(map(pictures => pictures.length));
  }

  spanClass(index: number): string {
    return SPAN_PATTERN[index % SPAN_PATTERN_LENGTH] || '';
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  openLightbox(index: number): void {
    this.lightboxIndex = index;
  }

  closeLightbox(): void {
    this.lightboxIndex = -1;
  }

  previousPicture(event?: Event): void {
    event?.stopPropagation();
    this.moveLightbox(-1);
  }

  nextPicture(event?: Event): void {
    event?.stopPropagation();
    this.moveLightbox(1);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.lightboxIndex < 0) {
      return;
    }
    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      this.moveLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      this.moveLightbox(1);
    }
  }

  private moveLightbox(offset: number): void {
    const amountOfPictures = this._pictures$.getValue().length;
    if (amountOfPictures === 0) {
      return;
    }
    this.lightboxIndex = ((this.lightboxIndex + offset) % amountOfPictures + amountOfPictures) % amountOfPictures;
  }
}
