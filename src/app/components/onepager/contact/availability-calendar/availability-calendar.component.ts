import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as ICAL from 'ical.js';
import { HttpClient } from '@angular/common/http';
import { Unsubscribable } from '../../../../shared/util/unsubscribable';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'bnb-availability-calendar',
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityCalendarComponent extends Unsubscribable implements OnInit {
  // https://www.airbnb.be/calendar/ical/12102270.ics?s=43d614d026f02aef4ac8431f625b3433
  // https://calendar.google.com/calendar/ical/a2cpg0o6c8rfv2479ga1fkshe9g34ahh%40import.calendar.google.com/public/basic.ics

  viewDate: Date = new Date();

  private _events$ = new BehaviorSubject<CalendarEvent[]>([]);

  constructor(private _httpClient: HttpClient) {
    super();
  }

  ngOnInit() {
    this._httpClient.get('/assets/calendar.ics', {responseType: 'text'})
      .takeUntil(this.ngUnsubscribe$)
      .subscribe(value => this.initCalendar(value));
  }

  get events$(): Observable<CalendarEvent[]> {
    return this._events$.asObservable();
  }

  get preventClickPrevious(): boolean {
    const now = new Date();
    return this.viewDate.getFullYear() <= now.getFullYear()
      && this.viewDate.getMonth() <= now.getMonth();
  }

  private initCalendar(calData: string) {
    const parsed = ICAL.parse(calData);
    const comp = new ICAL.Component(parsed);
    const vevents = comp.getAllSubcomponents('vevent');
    const events: CalendarEvent[] = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      const startDate: Date = event.startDate.toJSDate();
      const endDate: Date = event.endDate.toJSDate();
      endDate.setDate(endDate.getDate() - 1);

      return {
        start: startDate,
        end: endDate,
        allDay: true,
        cssClass: 'oi',
        // meta: event
      } as CalendarEvent;
    });
    this._events$.next(events);
  }
}
