import { CalendarEntry } from './calendar-entry';
import * as rp from 'request-promise';
import * as functions from 'firebase-functions';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const ICAL = require('ical.js');

initializeApp();
const db = getFirestore('firestore-eu');

function parseCalendar(calData: any): CalendarEntry[] {
  const parsed = ICAL.parse(calData);
  const comp = new ICAL.Component(parsed);
  const vevents = comp.getAllSubcomponents('vevent');
  return vevents.map((vevent: any) => {
    const event = new ICAL.Event(vevent);
    const startDate: Date = event.startDate.toJSDate();
    const endDate: Date = event.endDate.toJSDate();
    endDate.setDate(endDate.getDate() - 1);

    return {
      startDate: startDate,
      endDate: endDate
    } as CalendarEntry;
  });
}

function saveCalendarEntries(calendarEntries: CalendarEntry[], calendarDoc: string): Promise<any> {
  console.info('saving ' + calendarEntries.length + ' calendar entries');
  return db.collection('data').doc(calendarDoc).set({entries: calendarEntries});
}

exports.refreshAirbnbCalendar = functions.https.onRequest({region: 'europe-west1'}, (req, res) => {
  rp({
    uri: 'https://calendar.google.com/calendar/ical/a2cpg0o6c8rfv2479ga1fkshe9g34ahh%40import.calendar.google.com/public/basic.ics',
    method: 'GET'
  }).then(calData => {
    const calendarEntries = parseCalendar(calData);
    saveCalendarEntries(calendarEntries, 'calendar').then(() => {
      res.status(200).send('saving calendar data complete');
    }).catch(error => {
      console.error('could not save calendar data: ', error, JSON.stringify(error));
      res.status(200).send('could not save calendar data: ' + JSON.stringify(error));
    });
  }).catch(error => {
    console.error('fetching airbnb calendar faileddd: ', error, JSON.stringify(error));
    res.status(200).send('refresh failedddd: ' + JSON.stringify(error));
  });
});

exports.refreshAirbnbCalendar2 = functions.https.onRequest({region: 'europe-west1'}, (req, res) => {
  rp({
    uri: 'https://calendar.google.com/calendar/ical/lo809anhm07epg6v2ocgb58567lo70hs%40import.calendar.google.com/public/basic.ics',
    method: 'GET'
  }).then(calData => {
    const calendarEntries = parseCalendar(calData);
    saveCalendarEntries(calendarEntries, 'calendar2').then(() => {
      res.status(200).send('saving calendar2 data complete');
    }).catch(error => {
      console.error('could not save calendar2 data: ', JSON.stringify(error));
      res.status(200).send('could not save calendar2 data: ' + JSON.stringify(error));
    });
  }).catch(error => {
    console.error('fetching airbnb calendar2 failed: ', JSON.stringify(error));
    res.status(200).send('refresh2 failed: ' + JSON.stringify(error));
  });
});
