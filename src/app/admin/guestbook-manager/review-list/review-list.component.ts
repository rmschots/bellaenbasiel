import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { GuestbookEntry } from '../../../shared/models/firebase-data';
import { CreateReviewDialogComponent } from '../create-review/create-review-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'bnb-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListComponent extends Unsubscribable implements OnInit, AfterViewInit {

  static dialogConfig = {
    width: '90vw',
    maxWidth: '1120px'
  };

  displayedColumns = ['author', 'date', 'stars', 'content', 'delete'];

  dataSource: MatTableDataSource<GuestbookEntry> = new MatTableDataSource<GuestbookEntry>([]);

  selection = new SelectionModel<GuestbookEntry>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _firebaseService: FirebaseService, private _dialog: MatDialog, private _snackBar: MatSnackBar) {
    super();
  }

  createReview() {
    this._dialog.open(CreateReviewDialogComponent, ReviewListComponent.dialogConfig)
      .afterClosed().takeUntil(this.ngUnsubscribe$)
      .subscribe(result => {
        if (result) {
          this._snackBar.open('Successfully created guestbook entry', '', {
            duration: 5000,
          });
        }
      });
  }

  deleteReview(entry: GuestbookEntry) {
    this._dialog.open(ConfirmationDialogComponent, {
      data: {title: 'GUESTBOOK_MANAGER.delete.title', text: 'GUESTBOOK_MANAGER.delete.text'}
    }).afterClosed().takeUntil(this.ngUnsubscribe$).subscribe(result => {
      if (result) {
        this._firebaseService.deleteGuestbookEntry(entry);
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._firebaseService.guestbookData$
      .filter(data => !!data)
      .map(data => data.entries)
      .takeUntil(this.ngUnsubscribe$)
      .subscribe(entries => {
        this.dataSource.data = entries;
      });
  }

}
