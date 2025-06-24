import { IMongodbDocument } from "./mongo.interface";

export interface IProductCategory {
  name: string;
  description?: string;
  parentId?: string; // ID của danh mục cha
  metaTitle?: string;       // SEO
  metaDescription?: string; // SEO
  metaKeywords?: string[];  // SEO
}

export type TProductCategoryModel = IProductCategory & IMongodbDocument;