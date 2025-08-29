import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { PrefixBackendStaticPipe } from '../../pipe/prefix-backend.pipe';
import { CurrencyCustomPipe } from '../../pipe/currency-custom.pipe';
import { NumberInputComponent } from '../number-input/number-input.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOrderItem, TOrderItem } from '../../interface/order-response.interface';
import { OrderItemEntity } from '../../../entity/order.entity';
import { MatListItem } from '@angular/material/list';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../interface/confirmation-dialog.interface';
import { BreakpointDetectionService } from '../../../service/breakpoint-detection.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, lastValueFrom, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { TProductModel } from '../../interface/product.interface';
import { ProductService } from '../../../service/api/product.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { APP_LANGUAGE } from '../../constant/lang.constant';

@Component({
  selector: 'app-order-item-modify',
  standalone: true,
  imports: [
    CommonModule,

    PrefixBackendStaticPipe,
    CurrencyCustomPipe,

    NumberInputComponent,

    MaterialModule
  ],
  templateUrl: './order-item-modify.component.html',
  styleUrls: ['./order-item-modify.component.scss']
})
export class OrderItemModifyComponent implements OnInit, OnDestroy {
  readonly lang = inject(APP_LANGUAGE);
  private readonly matDialog = inject(MatDialog)
  private readonly dialogRef = inject(MatDialogRef<OrderItemModifyComponent>);
  readonly orderItems = inject<TOrderItem[] | null>(MAT_DIALOG_DATA);
  readonly isMobile$ = inject(BreakpointDetectionService).isMobile$;
  private readonly productService = inject(ProductService);
  orderItemEntity: OrderItemEntity | null = null;

  private readonly bNameOrProductElChange: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filteredOptions$: Observable<TProductModel[]> = this.bNameOrProductElChange.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((nameOrProduct) => this.productService.getAll(nameOrProduct).pipe(
      map((data) => data.data)
    ))
  );

  private readonly renderer2: Renderer2 = inject(Renderer2);

  private readonly subscription: Subscription = new Subscription();
  ngOnInit(): void {
    if (this.orderItems) {
      this.orderItemEntity = new OrderItemEntity(this.orderItems);
    }
  }

  inputValueChange(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();
    this.bNameOrProductElChange.next(value);

  }

  onChooseProductEvent(event: MatAutocompleteSelectedEvent, auto: MatAutocomplete) {
    const product = event.option.value as TProductModel;
    const orderItem: IOrderItem = {
      productId: product._id,
      productThumbnail: product.album?.thumbnailUrl || '',
      productCode: product.code,
      productName: product.name,
      productCategorySlug: product.slug,
      productSlug: product.slug,
      quantity: 1,
      price: product.price
    }
    this.orderItemEntity?.addItem(orderItem);

    auto.options.forEach((item) => {
      item.deselect()
    });
  }

  orderItemsQuantityChange(orderItem: IOrderItem, quantity: number) {
    this.orderItemEntity?.changeQuantity(orderItem.productId, quantity);
  }

  async onIsZero(orderItem: IOrderItem, cartItemElement: MatListItem) {
    const isMobile: boolean = await lastValueFrom(this.isMobile$.pipe(
      take(1)
    ));

    if (!isMobile) {
      return;
    }

    this.removeOrderItem(orderItem, cartItemElement);
  }

  removeOrderItem(orderItem: IOrderItem, cartItemElement: MatListItem) {
    this.subscription.add(
      this.confirmRemoveOrderItem$(orderItem).subscribe(_ => {
        this.renderer2.addClass(cartItemElement._elementRef.nativeElement, 'cart-item-removed');
        setTimeout(() => {
          this.orderItemEntity?.removeItem(orderItem.productId);
        }, 450);
      })
    )
  }

  private confirmRemoveOrderItem$(orderItem: IOrderItem) {
    const data: ConfirmationDialogData = {
      title: 'Xác nhận xóa sản phẩm',
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${orderItem.productName[this.lang]}" khỏi đơn hàng này?`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      type: 'warning'
    }
    return this.matDialog.open(ConfirmationDialogComponent, {
      data
    }).afterClosed().pipe(
      filter((result: boolean) => !!result)
    )
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onSaveChanges() {
    const isChangedItems$ = await lastValueFrom(this.orderItemEntity!.isChangedItems$.pipe(
      take(1)
    ));

    if (!isChangedItems$) {
      return;
    }

    this.dialogRef.close(this.orderItemEntity);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
