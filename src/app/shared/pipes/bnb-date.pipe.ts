import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
import { Timestamp } from '@firebase/firestore';

@Pipe({
  name: 'bnbDate'
})
export class BnbDatePipe implements PipeTransform {
  constructor(private _translateService: TranslocoService) {
  }

  public transform(value: any, pattern: string = 'mediumDate'): any {
    const ngPipe = new DatePipe(this._translateService.getActiveLang());
    if (value instanceof Timestamp) {
      return ngPipe.transform(value.toDate(), pattern);
    }
    return ngPipe.transform(value, pattern);
  }

}
