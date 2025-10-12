export interface GuestbookEntry {
  source: string,
  id: string,
  language: string,
  comments: string,
  originalRating: number,
  rating: number,
  createdAt: Date,
  reviewer: {
    firstName: string,
    pictureUrl: string,
  },
}


export interface BookingReviewsResponse {
  result: BookingReview[];
  count: number;
  sort_options: any[];
}

export interface BookingReview {
  is_trivial: number;
  title: string;
  hotelier_name: string;
  helpful_vote_count: number;
  hotelier_response: string;
  countrycode: string;
  title_translated: string;
  pros: string;
  cons: string;
  hotel_id: number;
  user_new_badges: any[];
  review_id: number;
  author: Author;
  review_hash: string;
  languagecode: string;
  travel_purpose: string;
  stayed_room_info: StayedRoomInfo;
  pros_translated: string;
  cons_translated: string;
  is_moderated: number;
  reviewer_photos: ReviewerPhoto[];
  date: string;
  reviewng: number;
  average_score: number;
  anonymous: any;
  is_incentivised: number;
  tags: any[];
  hotelier_response_date?: number;
}

export interface Author {
  type: string;
  name: string;
  nr_reviews: number;
  helpful_vote_count: number;
  age_group: string;
  countrycode: string;
  city: string;
  type_string: string;
  avatar?: string;
  user_id?: number;
}

export interface StayedRoomInfo {
  photo: Photo;
  checkin: string;
  room_id: number;
  checkout: string;
  num_nights: number;
  room_name: string;
}

export interface Photo {
  url_max300: string;
  url_square60: string;
  photo_id: number;
  url_original: string;
  url_640x200: string;
  ratio: number;
}

export interface ReviewerPhoto {
  square60_ao: string;
  square90: string;
  max1280x900: string;
  max500_ao: string;
}
