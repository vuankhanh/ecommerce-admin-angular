import { ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { MediaLogoService } from '../../../../service/api/media-logo.service';
import { catchError, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TAlbumModel, TMediaModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';
import { IFileUpload } from '../../../../shared/interface/file-upload.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fileValidator } from '../../../../shared/utitl/form-validator/files_array.validator';
import { MaterialModule } from '../../../../shared/modules/material';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    FileDragAndDropComponent,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent implements OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  mainLogo$: Observable<TMediaModel> = this.mediaLogoService.getMain();
  private logo$: Observable<TAlbumModel> = this.mediaLogoService.get();

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
    private mediaLogoService: MediaLogoService,
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
          next: () => {
            this.childComponentRef.reset();
            this.mainLogo$ = this.mediaLogoService.getMain();
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
