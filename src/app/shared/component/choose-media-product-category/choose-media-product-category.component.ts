import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MediaProductCategoryService } from '../../../service/api/media-product-category.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TAlbumModel } from '../../interface/album.interface';
import { MatListModule } from '@angular/material/list';
import { PrefixBackendStaticPipe } from '../../pipe/prefix-backend.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BehaviorSubject, lastValueFrom, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-choose-media-product-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    PrefixBackendStaticPipe,

    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './choose-media-product-category.component.html',
  styleUrl: './choose-media-product-category.component.scss'
})
export class ChooseMediaProductCategoryComponent implements OnChanges, AfterViewInit {
  @ViewChild('mediaProductCategoryEl') mediaProductCategoryEl!: ElementRef<MatInput>;

  @Input() mediaId: string = '';
  @Output() mediaProductCategoryEmit: EventEmitter<TAlbumModel | null> = new EventEmitter<TAlbumModel | null>();

  private readonly bMediaBroductCategoryEl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private mediaBroductCategoryEl$ = this.bMediaBroductCategoryEl.asObservable();
  mediaProductCategory$: Observable<TAlbumModel[]> = this.mediaBroductCategoryEl$.pipe(
    startWith(''),
    switchMap((value: string) => this.mediaProductCategoryService.getAll(value).pipe(
      map(res => res.data),
      map((mediaProductCategories: TAlbumModel[]) => {
        const filterValue = value.toLowerCase();
        return mediaProductCategories.filter((mediaProductCategory: TAlbumModel) => {
          return mediaProductCategory.name.toLowerCase().includes(filterValue);
        });
      })
    ))
  );

  mediaProductCategorySelected: TAlbumModel | null = null;

  constructor(
    private mediaProductCategoryService: MediaProductCategoryService,
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    const mediaId = changes['mediaId'];
    if (mediaId.currentValue && mediaId.currentValue.length && mediaId.currentValue != mediaId.previousValue) {

      const id = mediaId.currentValue as string;
      lastValueFrom(this.mediaProductCategoryService.getDetail(id)).then((res) => {
        this.mediaProductCategorySelected = res;
        this.cdr.detectChanges();
      })
    }

  }

  ngAfterViewInit(): void {
    this.renderer.listen(this.mediaProductCategoryEl.nativeElement, 'input', () => {
      this.bMediaBroductCategoryEl.next(this.mediaProductCategoryEl.nativeElement.value);
    });
  }

  onMediaProductCategoryBlur() {
    const mediaProductCategorySelectedName = this.mediaProductCategorySelected?.name;
    this.mediaProductCategoryEl.nativeElement.value = mediaProductCategorySelectedName ? mediaProductCategorySelectedName : '';
  }

  onMEdiaCategoryOptionSelected(event: MatAutocompleteSelectedEvent) {
    const mediaProductCategorySelected: TAlbumModel = event.option.value;
    this.mediaProductCategorySelected = mediaProductCategorySelected;
    this.mediaProductCategoryEl.nativeElement.value = mediaProductCategorySelected.name;
    this.mediaProductCategoryEmit.emit(mediaProductCategorySelected);
  }
}
