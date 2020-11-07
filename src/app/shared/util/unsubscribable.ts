import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class Unsubscribable implements OnDestroy {

  protected ngUnsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
