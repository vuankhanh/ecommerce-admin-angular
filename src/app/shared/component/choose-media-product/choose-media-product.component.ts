import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MediaProductService } from '../../../service/api/media-product.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TAlbumModel } from '../../interface/album.interface';
import { MatListModule } from '@angular/material/list';
import { PrefixBackendStaticPipe } from '../../pipe/prefix-backend.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BehaviorSubject, lastValueFrom, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-choose-media-product',
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
  templateUrl: './choose-media-product.component.html',
  styleUrl: './choose-media-product.component.scss'
})
export class ChooseMediaProductComponent implements OnChanges, AfterViewInit {
  @ViewChild('mediaProductEl') mediaProductEl!: ElementRef<MatInput>;

  @Input() mediaId: string = '';
  @Output() mediaProductEmit: EventEmitter<TAlbumModel | null> = new EventEmitter<TAlbumModel | null>();

  private readonly bMediaBroductEl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private mediaBroductEl$ = this.bMediaBroductEl.asObservable();
  mediaProduct$: Observable<TAlbumModel[]> = this.mediaBroductEl$.pipe(
    startWith(''),
    switchMap((value: string) => this.mediaProductService.getAll(value).pipe(
      map(res => res.data),
      map((mediaProductCategories: TAlbumModel[]) => {
        const filterValue = value.toLowerCase();
        return mediaProductCategories.filter((mediaProduct: TAlbumModel) => {
          return mediaProduct.name.toLowerCase().includes(filterValue);
        });
      })
    ))
  );

  mediaProductSelected: TAlbumModel | null = null;

  constructor(
    private mediaProductService: MediaProductService,
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {

  }

  ngOnChanges(changes: SimpleChanges) {
    const mediaId = changes['mediaId'];
    if (mediaId.currentValue && mediaId.currentValue.length && mediaId.currentValue != mediaId.previousValue) {

      const id = mediaId.currentValue as string;
      lastValueFrom(this.mediaProductService.getDetail(id)).then((res) => {
        this.mediaProductSelected = res;
        this.cdr.detectChanges();
      })
    }

  }

  ngAfterViewInit(): void {
    this.renderer.listen(this.mediaProductEl.nativeElement, 'input', () => {
      this.bMediaBroductEl.next(this.mediaProductEl.nativeElement.value);
    });
  }

  onMediaProductBlur() {
    const mediaProductSelectedName = this.mediaProductSelected?.name;
    this.mediaProductEl.nativeElement.value = mediaProductSelectedName ? mediaProductSelectedName : '';
  }

  onMEdiaOptionSelected(event: MatAutocompleteSelectedEvent) {
    const mediaProductSelected: TAlbumModel = event.option.value;
    this.mediaProductSelected = mediaProductSelected;
    this.mediaProductEl.nativeElement.value = mediaProductSelected.name;
    this.mediaProductEmit.emit(mediaProductSelected);
  }
}
