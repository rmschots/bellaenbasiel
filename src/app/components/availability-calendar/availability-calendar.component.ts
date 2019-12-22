import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Unsubscribable } from '../../shared/util/unsubscribable';
import { TranslationService } from '../../shared/services/translation.service';
import { FirebaseCalendar } from '../../shared/models/firebase-data';
import { map } from 'rxjs/operators';


@Component({
  selector: 'bnb-availability-calendar',
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityCalendarComponent extends Unsubscribable {

  viewDate: Date = new Date();

  private _events$ = new BehaviorSubject<CalendarEvent[]>([]);

  constructor(private _translationService: TranslationService,
              private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  @Input()
  set firebaseCalendar(firebaseCalendar: FirebaseCalendar) {
    if (firebaseCalendar) {
      this.updateCalendar(firebaseCalendar);
    }
  }

  get language$() {
    return this._translationService.currentLanguage$.pipe(map(lang => lang.code));
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
    this._changeDetectorRef.detectChanges();
  }
}
