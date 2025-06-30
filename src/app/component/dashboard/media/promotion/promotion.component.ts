import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { catchError, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { MediaPromotionService } from '../../../../service/api/media-promotionservice';
import { CommonModule } from '@angular/common';
import { IFileUpload } from '../../../../shared/interface/file-upload.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fileValidator } from '../../../../shared/utitl/form-validator/files_array.validator';
import { MaterialModule } from '../../../../shared/modules/material';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    PrefixBackendStaticPipe,
    FileDragAndDropComponent,

    MaterialModule
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent implements OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  mainPromotion$: Observable<TMediaModel> = this.mediaPromotionService.getMain();
  private promotion$: Observable<TAlbumModel> = this.mediaPromotionService.get();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.formBuilder.group({
    file: this.formBuilder.group({
      file: [null, [Validators.required]],
      description: [''],
      alternateName: [''],
      isMain: [false]
    }, { validators: [Validators.required, fileValidator] })
  });

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private mediaPromotionService: MediaPromotionService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  handleFilesUploaded(fileUploads: IFileUpload[]): void {
    const fileUpload = fileUploads[0];
    const valuePatch = fileUpload ? {
      file: fileUpload.file,
      description: fileUpload.description || '',
      alternateName: fileUpload.alternateName || '',
      isMain: fileUpload.isMain || false
    } : {
      file: null,
      description: '',
      alternateName: '',
      isMain: false
    }

    this.formGroup.get('file')?.patchValue(valuePatch);

    this.cdr.detectChanges();
  }

  uploadFiles(): void {
    if (this.formGroup.valid) {
      const fileUpload: IFileUpload = this.formGroup.get('file')?.value as IFileUpload;
      const createApi$: Observable<TAlbumModel> = this.mediaPromotionService.create(fileUpload)
      const updateApi$: Observable<TAlbumModel> = this.mediaPromotionService.update(fileUpload);
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
            this.childComponentRef.reset();
            this.mainPromotion$ = this.mediaPromotionService.getMain();
          },
          error: (err) => {
            console.error('Error uploading logo:', err);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
