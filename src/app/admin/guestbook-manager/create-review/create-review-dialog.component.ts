import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ECalendarValue, IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GuestbookEntry } from '../../../shared/models/firebase-data';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'bnb-create-review',
  templateUrl: './create-review-dialog.component.html',
  styleUrls: ['./create-review-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateReviewDialogComponent extends Unsubscribable {
  datepickerConfig: IDatePickerDirectiveConfig = {
    format: 'MMMM YYYY',
    returnedValueType: ECalendarValue.Moment
  };

  formsubmitting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  createReviewGroup: FormGroup;

  constructor(fb: FormBuilder,
              private _firebaseService: FirebaseService,
              private _dialogRef: MatDialogRef<CreateReviewDialogComponent>,
              private _snackBar: MatSnackBar) {
    super();
    this.createReviewGroup = fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required]],
      stars: [5, Validators.required],
      text: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.createReviewGroup.valid) {
      this.formsubmitting$.next(true);
      const rawValue = this.createReviewGroup.getRawValue();
      const guestbookEntry = {
        author: rawValue.name,
        date: new Date(rawValue.date),
        stars: rawValue.stars,
        content: rawValue.text
      } as GuestbookEntry;
      this._firebaseService.createGuestbookEntry(guestbookEntry).takeUntil(this.ngUnsubscribe$)
        .subscribe(() => {
            console.log('guestbookentry created');
            this._dialogRef.close(true);
          },
          error => {
            console.error('Could not add review: ', error);
            this.formsubmitting$.next(false);
            this._snackBar.open('No Permissions to add review', null, {
              duration: 5000
            });
          });
    }
  }

  private reset() {
    this.createReviewGroup.reset({
      name: '',
      date: '',
      stars: 5,
      text: ''
    });
  }
}
