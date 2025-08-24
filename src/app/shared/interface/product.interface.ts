import { TAlbumModel } from "./album.interface";
import { IMongodbDocument } from "./mongo.interface";
import { TProductCategoryModel } from "./product-category.interface";

export interface IProductReview {
  userId: string;
  rating: number; // 1-5
  comment: string;
}

export interface IProduct {
  name: { [key: string]: string }; // Hỗ trợ đa ngôn ngữ, key là mã ngôn ngữ (vi, en, ja,...)
  code: string; // Mã sản phẩm
  description: { [key: string]: string }; // Hỗ trợ đa ngôn ngữ, key là mã ngôn ngữ (vi, en, ja,...)
  shortDescription: { [key: string]: string }; // Mô tả ngắn, hỗ trợ đa ngôn ngữ
  albumId?: string; // ID của album chứa ảnh sản phẩm
  album?: TAlbumModel;
  price: number;
  slug: string; // Đường dẫn sản phẩm
  productCategoryId?: string; // ID của danh mục sản phẩm
  productCategory?: TProductCategoryModel; // Danh mục sản phẩm
  inStock: boolean;
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}

export type TProductModel = IProduct & IMongodbDocument;