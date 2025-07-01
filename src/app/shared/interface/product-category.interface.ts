import { IMongodbDocument } from "./mongo.interface";

export interface IProductCategory {
  name: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export type TProductCategoryModel = IProductCategory & IMongodbDocument;