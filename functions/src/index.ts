import { CalendarEntry } from './calendar-entry';
import * as rp from 'request-promise';
import * as functions from 'firebase-functions';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { BookingReviewsResponse, GuestbookEntry } from './booking';

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

function saveGuestbookEntries(latestGuestbookEntries: GuestbookEntry[]): Promise<any> {
  console.info('syncing ' + latestGuestbookEntries.length + ' booking.com entries');
  return db.collection('data').doc('guestbookV2').get()
    .then(doc => {
      let entries: GuestbookEntry[] = [];
      if (doc.exists) {
        entries = doc.get('entries') || [];
      }
      const newEntries = latestGuestbookEntries.filter(entry => {
        return !entries.some(existingEntry => existingEntry.source == 'BOOKING' && existingEntry.id === entry.id);
      });
      if (newEntries.length === 0) {
        console.info('no new booking.com entries');
        return null;
      } else {
        console.info('saving ' + newEntries.length + ' new booking.com entries');
      }
      return db.collection('data').doc('guestbookV2').set({entries: entries.concat(newEntries)});
    })
    .catch(error => {
      console.error('could not sync booking.com entries: ', error, JSON.stringify(error));
    });
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

exports.syncReviews = functions.https.onRequest({region: 'europe-west1'}, (req, res) => {
  rp({
    uri: 'https://mobile-apps.booking.com/json/bookings.getHotelReviews?include_avatar=1&show_title=1&show_review_id=1&hotel_ids=6788656&offset=0&rows=100&use_new_group_sorting=1&use_new_customer_types=1&user_sort=sort_recent_desc&notification_auth_status=1&user_version=60.2.1-android&device_id=bda26227-0e57-4fde-845b-f5e4f9aacd2b',
    method: 'GET',
    headers: {
      'Authorization': 'Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN' // This is not a secret, it's hardcoded in the booking.com app
    }
  }).then(reviewsJson => {
    const response: BookingReviewsResponse = JSON.parse(reviewsJson);
    const data: GuestbookEntry[] = response.result.map(review => {
      return {
        source: 'BOOKING',
        id: String(review.review_id),
        language: review.languagecode.split('-')[0],
        comments: review.title + '\n' + review.pros,
        originalRating: review.average_score,
        rating: Math.round(review.average_score + 1),
        createdAt: new Date(review.date),
        reviewer: {
          firstName: review.author.name,
          pictureUrl: review.author.avatar || null,
        },
      } as GuestbookEntry;
    });
    if (data.length === 0) {
      res.status(200).send(
        'No reviews found'
      );
    } else {
      saveGuestbookEntries(data).then(() => {
        res.status(200).send('Reviews synced');
      }).catch(error => {
        console.error('could not save guestbook entries: ', JSON.stringify(error));
        res.status(200).send('could not save guestbook entries: ' + JSON.stringify(error));
      });
    }
  }).catch(error => {
    console.error('Failed fetching reviews: ', JSON.stringify(error));
    res.status(200).send('Failed fetching reviews: ' + JSON.stringify(error));
  });
});
