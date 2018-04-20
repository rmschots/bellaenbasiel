import { Component } from '@angular/core';
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';

@Component({
  selector: 'bnb-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss']
})
export class CreateReviewComponent {
  datepickerConfig: IDatePickerDirectiveConfig = {
    format: 'MMMM YYYY'
  };
}
