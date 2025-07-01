import { IMongodbDocument } from "./mongo.interface";

export interface IProductReview {
  userId: string;
  rating: number; // 1-5
  comment: string;
}

export interface IProduct {
  name: string;
  description: string;
  shortDescription: string;
  albumId: string; // ID của album chứa ảnh sản phẩm
  price: number;
  category: string;
  stock: number;
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}

export type TProductModel = IProduct & IMongodbDocument;