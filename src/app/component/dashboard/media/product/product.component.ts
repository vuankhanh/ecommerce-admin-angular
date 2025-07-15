import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { MaterialModule } from '../../../../shared/modules/material';
import { Router } from '@angular/router';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';
import { BehaviorSubject, Observable, startWith, switchMap } from 'rxjs';
import { MediaProductService, TAlbumProduct } from '../../../../service/api/media-product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PrefixBackendStaticPipe,

    MaterialModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  searchControl = new FormControl<string>('');

  products$: Observable<TAlbumProduct> = this.searchControl.valueChanges.pipe(
    startWith(''),
    switchMap(term => this.mediaProductService.getAll(term ? term : ''))
  );
  
  isMobile$ = this.breakpointDetectionService.isMobile$;

  constructor(
    private router: Router,
    private readonly breakpointDetectionService: BreakpointDetectionService,
    private readonly mediaProductService: MediaProductService
  ) { }

  createProduct() {
    this.router.navigate(['dashboard/media/product/create']);
  }

  productDetail(id: string) {
    this.router.navigate(['dashboard/media/product', id]);
  }
}
