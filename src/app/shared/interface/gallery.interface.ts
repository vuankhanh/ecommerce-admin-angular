import { GalleryItem } from "@daelmaak/ngx-gallery";

export interface IGalleryItem extends GalleryItem {
  _id: string;
  description: string;
  isHighlight: boolean;
}