import { TAlbumModel } from "./album.interface";
import { IMongodbDocument } from "./mongo.interface";

export interface IProductCategory {
  name: { [lang: string]: string };
  slug: string;
  description?: { [lang: string]: string };
  albumId: string;
  album: TAlbumModel;
  parentId?: string;
  parent?: TProductCategoryModel;
  isActive?: boolean;
  productCount?: number;
}

export type TProductCategoryModel = IProductCategory & IMongodbDocument;