export interface RoomImage {
  src: string;
  captionKey: string;
}

export interface RoomTag {
  key: string;
  params?: Record<string, unknown>;
}

export interface RoomConfig {
  id: number;
  price: number;
  images: RoomImage[];
  tags: RoomTag[];
}
