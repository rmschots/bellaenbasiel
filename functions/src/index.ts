import { CalendarEntry } from './calendar-entry';
import * as rp from 'request-promise';
import * as functions from 'firebase-functions';
import { onSchedule } from 'firebase-functions/scheduler';

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
  const calendarEntries = vevents.map((vevent: any) => {
    const event = new ICAL.Event(vevent);
    const startDate: Date = event.startDate.toJSDate();
    const endDate: Date = event.endDate.toJSDate();
    endDate.setDate(endDate.getDate() - 1);

    return {
      startDate: startDate,
      endDate: endDate
    } as CalendarEntry;
  });

  // Ensure entries are ordered by start date
  calendarEntries.sort((a: CalendarEntry, b: CalendarEntry) => a.startDate.getTime() - b.startDate.getTime());

  // Insert one-day availability gaps as unavailable days
  const extraEntries: CalendarEntry[] = [];
  for (let i = 0; i < calendarEntries.length - 1; i++) {
    const prevEnd = new Date(calendarEntries[i].endDate);
    const nextStart = new Date(calendarEntries[i + 1].startDate);
    // Normalize to midnight to avoid DST/timezone issues when computing day differences
    prevEnd.setHours(0, 0, 0, 0);
    nextStart.setHours(0, 0, 0, 0);

    const diffDays = Math.round((nextStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24));
    // If exactly one free day between two unavailable ranges, mark that day as unavailable too
    if (diffDays === 2) {
      const blockedDay = new Date(prevEnd);
      blockedDay.setDate(blockedDay.getDate() + 1);
      extraEntries.push({
        startDate: blockedDay,
        endDate: blockedDay
      } as CalendarEntry);
    }
  }

  const allEntries = calendarEntries.concat(extraEntries);
  allEntries.sort((a: CalendarEntry, b: CalendarEntry) => a.startDate.getTime() - b.startDate.getTime());

  return allEntries;
}

function saveCalendarEntries(calendarEntries: CalendarEntry[], calendarDoc: string): Promise<any> {
  functions.logger.info('saving ' + calendarEntries.length + ' calendar entries');
  return db.collection('data').doc(calendarDoc).set({entries: calendarEntries});
}

function saveGuestbookEntries(latestGuestbookEntries: GuestbookEntry[]): Promise<any> {
  functions.logger.info('syncing ' + latestGuestbookEntries.length + ' booking.com entries');
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
        functions.logger.info('no new booking.com entries');
        return null;
      } else {
        functions.logger.info('saving ' + newEntries.length + ' new booking.com entries');
      }
      return db.collection('data').doc('guestbookV2').set({entries: entries.concat(newEntries)});
    })
    .catch(error => {
      functions.logger.error('could not sync booking.com entries: ', error, JSON.stringify(error));
    });
}

exports.refreshBookingCalendarRoom1 = onSchedule('0 * * * *', async () => {
  rp({
    uri: 'https://ical.booking.com/v1/export?t=a2a2a7eb-66a3-4bb2-b9e5-cf55a2fd43e3',
    method: 'GET'
  }).then(calData => {
    const calendarEntries = parseCalendar(calData);
    saveCalendarEntries(calendarEntries, 'calendar').then(() => {
      functions.logger.info('saving CalendarRoom1 data complete');
    }).catch(error => {
      functions.logger.error('could not save CalendarRoom1 data: ', error, JSON.stringify(error));
    });
  }).catch(error => {
    functions.logger.error('fetching booking CalendarRoom1 failed: ', error, JSON.stringify(error));
  });
});

exports.refreshBookingCalendarRoom23 = onSchedule('0 * * * *', async () => {
  rp({
    uri: 'https://ical.booking.com/v1/export?t=16df72b4-800d-48d0-bdc7-5d94c5ef4e47',
    method: 'GET'
  }).then(calData => {
    const calendarEntries = parseCalendar(calData);
    saveCalendarEntries(calendarEntries, 'calendar2').then(() => {
      functions.logger.info('saving CalendarRoom23 data complete');
    }).catch(error => {
      functions.logger.error('could not save CalendarRoom23 data: ', error, JSON.stringify(error));
    });
  }).catch(error => {
    functions.logger.error('fetching booking CalendarRoom23 failed: ', error, JSON.stringify(error));
  });
});

exports.syncReviews = onSchedule('0 * * * *', async () => {
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
      functions.logger.info('No reviews found');
    } else {
      saveGuestbookEntries(data).then(() => {
        functions.logger.info('Reviews synced');
      }).catch(error => {
        functions.logger.error('could not save guestbook entries: ', JSON.stringify(error));
      });
    }
  }).catch(error => {
    functions.logger.error('Failed fetching reviews: ', JSON.stringify(error));
  });
});
