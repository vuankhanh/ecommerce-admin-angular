import { IPagination } from "./pagination.interface";
import { ISuccess } from "./success.interface";

export interface IProductCategory {
  name: string;
  description?: string;
  parentId?: string; // ID của danh mục cha
  metaTitle?: string;       // SEO
  metaDescription?: string; // SEO
  metaKeywords?: string[];  // SEO
}

export type TProductCategory = {
  data: IProductCategory[];
  pagination: IPagination;
}

export  interface IProductCategoryResponse extends ISuccess {
  metaData: TProductCategory;
}

export interface IProductCategoryDetailResponse extends ISuccess {
  metaData: IProductCategory;
}