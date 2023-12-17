import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CalendarDateFormatter, CalendarEvent } from 'angular-calendar';
import { TranslationService } from '../../shared/services/translation.service';
import { FirebaseCalendar } from '../../shared/models/firebase-data';
import { CustomDateFormatter } from './custom-date-formatter.provider';

@UntilDestroy()
@Component({
  selector: 'app-availability-calendar',
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AvailabilityCalendarComponent {
  viewDate: Date = new Date();

  private _events$ = new BehaviorSubject<CalendarEvent[]>([]);

  constructor(private _translationService: TranslationService,
              private _changeDetectorRef: ChangeDetectorRef) {
  }

  @Input()
  set firebaseCalendar(firebaseCalendar: FirebaseCalendar | null) {
    if (firebaseCalendar) {
      this.updateCalendar(firebaseCalendar);
    }
  }

  get language$(): Observable<string> {
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
