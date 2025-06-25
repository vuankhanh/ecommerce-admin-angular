import { IMongodbDocument } from "./mongo.interface";
import { IPagination } from "./pagination.interface"
import { ISuccess } from "./success.interface"

export interface IAlbum {
  name: string,
  description: string,
  route: string,
  thumbnailUrl: string,
  media: Array<TMediaModel>,
  mediaItems: number,
  createdAt: Date,
  updatedAt: Date
}

export interface IMedia {
  url: string,
  thumbnailUrl: string,
  name: string,
  description: string,
  caption: string,
  alternateName: string,
  type: 'image' | 'video',
  willRemove?: boolean,
  created: Date,
  updated: Date,
}

export type TAlbumModel = IAlbum & IMongodbDocument;
export type TMediaModel = IMedia & IMongodbDocument;