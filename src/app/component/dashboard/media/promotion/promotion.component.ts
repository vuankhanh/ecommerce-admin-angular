import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { catchError, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { MediaPromotionService } from '../../../../service/api/media-promotionservice';
import { IRequestParamsWithFiles } from '../../../../shared/interface/request.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    CommonModule,
    
    PrefixBackendStaticPipe,
    FileDragAndDropComponent
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent implements OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
    imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    mainPromotion$: Observable<TMediaModel> = this.mediaPromotionService.getMain();
    private promotion$: Observable<TAlbumModel> = this.mediaPromotionService.get();
  
    private readonly subscription: Subscription = new Subscription();
    constructor(
      private mediaPromotionService: MediaPromotionService
    ) { }
  
    handleFilesUploaded(params: IRequestParamsWithFiles): void {
      const description = params.description || '';
      const alternateName = params.alternateName || params.files[0].name;
      const file = params.files[0];
      const createApi$: Observable<TAlbumModel> = this.mediaPromotionService.create(alternateName, description, file)
      const updateApi$: Observable<TAlbumModel> = this.mediaPromotionService.update(alternateName, description, file);
      this.subscription.add(
        this.promotion$.pipe(
          catchError((err) => {
            if (err.status === 400) {
              return of(null);
            }
            return throwError(() => err);
          }),
          switchMap(res => {
            return res ? updateApi$ : createApi$;
          })
        ).subscribe({
          next: (res) => {
            this.childComponentRef.isEditing = true;
            this.mainPromotion$ = this.mediaPromotionService.getMain();
          },
          error: (err) => {
            console.error('Error uploading logo:', err);
          }
        })
      );
    }
  
    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
