import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'bnbDate'
})
export class BnbDatePipe implements PipeTransform {

  constructor(private _translateService: TranslateService) {

  }

  public transform(value: any, pattern: string = 'mediumDate'): any {
    const ngPipe = new DatePipe(this._translateService.currentLang);
    return ngPipe.transform(value, pattern);
  }

}
