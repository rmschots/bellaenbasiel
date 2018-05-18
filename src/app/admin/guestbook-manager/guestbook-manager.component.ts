import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../shared/services/firebase.service';
import { AirbnbReviews } from '../../shared/models/airbnb-reviews';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'bnb-guestbook-manager',
  templateUrl: './guestbook-manager.component.html',
  styleUrls: ['./guestbook-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookManagerComponent {
  addReviewsFormGroup: FormGroup;

  constructor(fb: FormBuilder, private _firebaseService: FirebaseService, private _snackBar: MatSnackBar) {
    this.addReviewsFormGroup = fb.group({
      reviewsJson: ['', Validators.required]
    });
  }

  onSubmit() {
    const reviewsString = this.addReviewsFormGroup.get('reviewsJson').value;
    const airbnbReviews: AirbnbReviews = JSON.parse(reviewsString);
    airbnbReviews.reviews.forEach(review => {
      if (review.rating === 0) {
        review.rating = 5;
      }
      review.created_at = new Date(review.created_at);
    });
    this._firebaseService
      .updateFirebaseGuestbook(airbnbReviews)
      .subscribe(
        () => {
          console.log('update success');
          this._snackBar.open('Reviews updaten voltooid', null, {
            duration: 5000
          });
        },
        error => {
          console.error('error updating guestbook', error);
          this._snackBar.open('Geen rechten om review toe te voegen', null, {
            duration: 5000
          });
        }
      );
  }
}
