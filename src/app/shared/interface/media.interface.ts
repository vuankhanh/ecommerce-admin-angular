interface IMedia{
  _id?: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  name: string;
  isHighlight: boolean;
  alternateName: string;
  description: string;
}

type MediaType = 'video' | 'image';

export interface IImage extends IMedia{
  duration?: number;
  type: 'image';
}

export interface IVideo extends IMedia{
  type: 'video';
}