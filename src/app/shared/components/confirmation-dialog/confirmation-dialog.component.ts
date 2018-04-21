import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CreateReviewDialogComponent } from '../../../admin/guestbook-manager/create-review/create-review-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'bnb-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
