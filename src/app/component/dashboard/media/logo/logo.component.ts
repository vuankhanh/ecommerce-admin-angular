import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { MediaLogoService } from '../../../../service/api/media-logo.service';
import { catchError, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';
import { IFileUpload } from '../../../../shared/interface/file-upload.interface';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    CommonModule,

    FileDragAndDropComponent,

    PrefixBackendStaticPipe
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent implements OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  mainLogo$: Observable<TMediaModel> = this.mediaLogoService.getMain();
  private logo$: Observable<TAlbumModel> = this.mediaLogoService.get();

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private mediaLogoService: MediaLogoService
  ) { }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    const fileUpload = fileUploads[0];
    const createApi$: Observable<TAlbumModel> = this.mediaLogoService.create(fileUpload)
    const updateApi$: Observable<TAlbumModel> = this.mediaLogoService.update(fileUpload);
    this.subscription.add(
      this.logo$.pipe(
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
          this.childComponentRef.reset();
          this.mainLogo$ = this.mediaLogoService.getMain();
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
