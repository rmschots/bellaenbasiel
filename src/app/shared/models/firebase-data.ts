import * as firebase from 'firebase';

export type FirebaseData = FirebaseCalendar | FirebaseGuestbook;

export interface FirebaseCalendar {
  entries: CalendarEntry[];
}

export interface CalendarEntry {
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
}

export interface FirebaseGuestbookReviewee {
  deleted: boolean;
  first_name: string;
  host_name: string;
  id: number;
  is_superhost: boolean;
  picture_url: string;
  profile_path: string;
}

export interface FirebaseGuestbookReviewer {
  deleted: boolean;
  first_name: string;
  host_name: string;
  id: number;
  is_superhost: boolean;
  picture_url: string;
  profile_path: string;
}

export interface FirebaseGuestbookReview {
  collection_tag?: any;
  comments: string;
  created_at: Date | firebase.firestore.Timestamp;
  id: number;
  language: string;
  localized_date: string;
  rating: number;
  response: string;
  reviewee: FirebaseGuestbookReviewee;
  reviewer: FirebaseGuestbookReviewer;
}

export interface FirebaseGuestbookMetadata {
  reviews_count: number;
  should_show_review_translations: boolean;
}

export interface FirebaseGuestbook {
  reviews: FirebaseGuestbookReview[];
  metadata: FirebaseGuestbookMetadata;
}
