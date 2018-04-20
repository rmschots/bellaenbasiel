import * as firebase from 'firebase';
// import Timestamp = firebase.firestore.Timestamp;

export type FirebaseData = FirebaseCalendar | FirebaseGuestbook;

export interface FirebaseCalendar {
  entries: CalendarEntry[];
}

export interface CalendarEntry {
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
}

export interface FirebaseGuestbook {
  entries: GuestbookEntry[];
}

export interface GuestbookEntry {
  author: string;
  stars: number;
  date: string;
  content: string;
}
