import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unsubscribable } from '../../../../shared/util/unsubscribable';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { FirebaseCalendar } from '../../../../shared/models/firebase-data';
import { TranslationService } from '../../../../shared/services/translation.service';
import { isEqual } from 'lodash';


@Component({
  selector: 'bnb-availability-calendar',
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityCalendarComponent extends Unsubscribable implements OnInit {

  viewDate: Date = new Date();

  private _events$ = new BehaviorSubject<CalendarEvent[]>([]);

  constructor(private _httpClient: HttpClient,
              private _firebaseService: FirebaseService,
              private _translationService: TranslationService) {
    super();
  }

  ngOnInit() {
    this._firebaseService.calendarData$.takeUntil(this.ngUnsubscribe$)
      .filter(value => !!value)
      .distinctUntilChanged((data1, data2) => isEqual(data1, data2))
      .subscribe(calendarData => this.updateCalendar(calendarData));
  }

  get language$() {
    return this._translationService.currentLanguage$.map(lang => lang.code);
  }

  get events$(): Observable<CalendarEvent[]> {
    return this._events$.asObservable();
  }

  get preventClickPrevious(): boolean {
    const now = new Date();
    return this.viewDate.getFullYear() <= now.getFullYear()
      && this.viewDate.getMonth() <= now.getMonth();
  }

  private updateCalendar(firebaseCalendar: FirebaseCalendar) {
    const events: CalendarEvent[] = firebaseCalendar.entries.map(calendarEntry => ({
      start: calendarEntry.startDate.toDate(),
      end: calendarEntry.endDate.toDate(),
      allDay: true,
      cssClass: 'oi'
    } as CalendarEvent));
    this._events$.next(events);
  }
}
