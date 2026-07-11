import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { Timestamp } from '@firebase/firestore';

@Pipe({
    name: 'bnbDate',
    standalone: false
})
export class BnbDatePipe implements PipeTransform {
  constructor(private _translateService: TranslocoService) {
  }

  // Pass the active language as `locale` when the date should re-render on
  // language switches: a changed argument makes this pure pipe re-evaluate.
  public transform(value: any, pattern: string = 'mediumDate', locale?: string | null): any {
    const ngPipe = new DatePipe(locale || this._translateService.getActiveLang());
    if (value instanceof Timestamp) {
      return ngPipe.transform(value.toDate(), pattern);
    }
    return ngPipe.transform(value, pattern);
  }

}
