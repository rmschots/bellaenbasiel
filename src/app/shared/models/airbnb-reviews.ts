export interface Reviewee {
  deleted: boolean;
  first_name: string;
  host_name: string;
  id: number;
  is_superhost: boolean;
  picture_url: string;
  profile_path: string;
}

export interface Reviewer {
  deleted: boolean;
  first_name: string;
  host_name: string;
  id: number;
  is_superhost: boolean;
  picture_url: string;
  profile_path: string;
}

export interface Review {
  collection_tag?: any;
  comments: string;
  created_at: Date;
  id: number;
  language: string;
  localized_date: string;
  rating: number;
  response: string;
  reviewee: Reviewee;
  reviewer: Reviewer;
}

export interface Metadata {
  reviews_count: number;
  should_show_review_translations: boolean;
}

export interface AirbnbReviews {
  reviews: Review[];
  metadata: Metadata;
}
