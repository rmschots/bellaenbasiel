import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { FirebaseGuestbookReview } from '../../../shared/models/firebase-data';

@Component({
  selector: 'bnb-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListComponent extends Unsubscribable implements OnInit, AfterViewInit {

  displayedColumns = ['author', 'date', 'stars', 'content'];

  dataSource: MatTableDataSource<FirebaseGuestbookReview> = new MatTableDataSource<FirebaseGuestbookReview>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private _firebaseService: FirebaseService) {
    super();
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
      .map(data => data.reviews)
      .takeUntil(this.ngUnsubscribe$)
      .subscribe(entries => {
        this.dataSource.data = entries;
      });
  }

}
