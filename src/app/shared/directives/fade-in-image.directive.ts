import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

/**
 * Fades an <img> in once its data has arrived, so pictures ease into the page
 * instead of popping in. Containers keep a warm placeholder background
 * (see the `fade-in-img` styles in styles.scss) while loading.
 */
@Directive({
  selector: 'img[appFadeIn]',
  standalone: false
})
export class FadeInImageDirective {
  @HostBinding('class.fade-in-img') readonly fadeInClass = true;
  @HostBinding('class.loaded') loaded = false;

  constructor(element: ElementRef<HTMLImageElement>) {
    // Already-cached images never fire a load event
    if (element.nativeElement.complete && element.nativeElement.naturalWidth > 0) {
      this.loaded = true;
    }
  }

  @HostListener('load')
  onLoad(): void {
    this.loaded = true;
  }

  @HostListener('error')
  onError(): void {
    // Show the (broken) image state rather than an invisible element
    this.loaded = true;
  }
}
