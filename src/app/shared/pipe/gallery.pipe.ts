import { Pipe, PipeTransform } from '@angular/core';
import { GalleryItem } from '@daelmaak/ngx-gallery';
import { TAlbumModel, TMediaModel } from '../interface/album.interface';
import { PrefixBackendStaticPipe } from './prefix-backend.pipe';

@Pipe({
  name: 'gallery',
  standalone: true
})
export class GalleryPipe implements PipeTransform {
  constructor(
    private readonly prefixBackendStaticPipe: PrefixBackendStaticPipe
  ) {

  }
  transform(value?: TAlbumModel | undefined): GalleryItem[] {
    console.log(value);
    
    if (value && value.media && value.media.length > 0) {
      const galleries: GalleryItem[] = value.media.map((media: TMediaModel) => {
        const src = this.prefixBackendStaticPipe.transform(media.url);
        const thumbSrc = this.prefixBackendStaticPipe.transform(media.thumbnailUrl);
        const galleryItem: GalleryItem = {
          src: src,
          thumbSrc: thumbSrc,
          description: media.description,
          alt: media.alternateName,
          video: media.type === 'video' ? true : false
        }
        return galleryItem;
      });

      return galleries;
    }
    return [];
  }

}
