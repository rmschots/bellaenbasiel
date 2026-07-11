import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TranslationService } from '../../shared/services/translation.service';
import { FirebaseCalendar } from '../../shared/models/firebase-data';

export interface CalendarCell {
  day: string;
  state: 'blank' | 'past' | 'booked' | 'free';
}

@Component({
    selector: 'app-availability-calendar',
    templateUrl: './availability-calendar.component.html',
    styleUrls: ['./availability-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AvailabilityCalendarComponent {
  @Input() name = '';

  private _calendar$ = new BehaviorSubject<FirebaseCalendar | null>(null);
  private _monthOffset$ = new BehaviorSubject<number>(0);

  constructor(private _translationService: TranslationService) {
  }

  @Input()
  set firebaseCalendar(firebaseCalendar: FirebaseCalendar | null) {
    this._calendar$.next(firebaseCalendar);
  }

  @Input()
  set monthOffset(monthOffset: number | null) {
    this._monthOffset$.next(monthOffset ?? 0);
  }

  get weekdays$(): Observable<string[]> {
    return this._translationService.currentLanguage$.pipe(map(language => {
      const format = new Intl.DateTimeFormat(language.code, {weekday: 'short'});
      // 2024-01-01 is a Monday; render a Monday-first header row
      return Array.from({length: 7}, (_, i) => {
        const weekday = format.format(new Date(2024, 0, 1 + i)).replace('.', '').slice(0, 2);
        return weekday.charAt(0).toUpperCase() + weekday.slice(1);
      });
    }));
  }

  get cells$(): Observable<CalendarCell[]> {
    return combineLatest([this._calendar$, this._monthOffset$]).pipe(
      map(([calendar, offset]) => this.buildCells(calendar, offset))
    );
  }

  private buildCells(calendar: FirebaseCalendar | null, offset: number): CalendarCell[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const bookedRanges = (calendar?.entries || []).map(entry => ({
      start: this.startOfDay(entry.startDate.toDate()),
      end: this.startOfDay(entry.endDate.toDate())
    }));

    const cells: CalendarCell[] = [];
    const leadingBlanks = (first.getDay() + 6) % 7;
    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({day: '', state: 'blank'});
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(first.getFullYear(), first.getMonth(), day).getTime();
      let state: CalendarCell['state'];
      if (date < today) {
        state = 'past';
      } else if (bookedRanges.some(range => date >= range.start && date <= range.end)) {
        state = 'booked';
      } else {
        state = 'free';
      }
      cells.push({day: String(day), state});
    }
    return cells;
  }

  private startOfDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
}
