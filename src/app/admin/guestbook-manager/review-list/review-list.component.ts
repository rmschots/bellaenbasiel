import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { GuestbookEntry } from '../../../shared/models/firebase-data';
import { cloneDeep } from 'lodash';
import { filter, map, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;


@Component({
  selector: 'bnb-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewListComponent extends Unsubscribable implements OnInit, AfterViewInit {

  displayedColumns = ['author', 'date', 'stars', 'content'];

  dataSource: MatTableDataSource<GuestbookEntry> = new MatTableDataSource<GuestbookEntry>([]);

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  private _originalData: GuestbookEntry[] = [];

  constructor(private _firebaseService: FirebaseService) {
    super();
  }

  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    let filterValue = target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._firebaseService.guestbookDataV2$.pipe(
      filter(data => !!data),
      map(data => data.entries),
      takeUntil(this.ngUnsubscribe$)
    )
      .subscribe(entries => {
        this._originalData = entries.sort((a, b) => this.compare(
          (<Timestamp>a.createdAt).toMillis(),
          (<Timestamp>b.createdAt).toMillis(),
          false)
        );
        this.dataSource.data = cloneDeep(entries);
        this.dataSource.sortData(this.dataSource.data, this.sort);
      });
  }

  trackByFunction: TrackByFunction<GuestbookEntry> = (index: number, item: GuestbookEntry) => {
    return item.id;
  };

  sortData(sort: Sort) {
    const data = cloneDeep(this._originalData);
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'author':
          return this.compare(a.reviewer.firstName, b.reviewer.firstName, isAsc);
        case 'date':
          return this.compare(
            (<firebase.firestore.Timestamp>a.createdAt).toMillis(),
            (<firebase.firestore.Timestamp>b.createdAt).toMillis(),
            isAsc
          );
        case 'stars':
          return this.compare(+a.rating, +b.rating, isAsc);
        case 'content':
          return this.compare(a.comments.toLowerCase(), b.comments.toLowerCase(), isAsc);
        default:
          return 0;
      }
    });
    console.log(this.dataSource.data);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
  }

}
