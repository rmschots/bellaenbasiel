import * as firebase from 'firebase';
// import Timestamp = firebase.firestore.Timestamp;

export type FirebaseData = FirebaseCalendar | GuestBook;

export interface FirebaseCalendar {
  entries: CalendarEntry[];
}

export interface CalendarEntry {
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
}

export interface GuestBook {
  entries: any[];
}
