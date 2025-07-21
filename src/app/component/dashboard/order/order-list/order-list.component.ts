import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderStatus } from '../../../../shared/constant/order.constant';
import { IPagination } from '../../../../shared/interface/pagination.interface';
import { paginationConstant } from '../../../../shared/constant/pagination.constant';
import { IOrderFilterParams, OrderService } from '../../../../service/api/order.service';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, distinctUntilChanged, map, switchMap, combineLatest, from, startWith } from 'rxjs';
import { OrderStatusColorDirective } from '../../../../shared/directive/order-status-color.directive';
import { BreakpointDetectionService } from '../../../../service/breakpoint-detection.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    RouterLink,

    OrderStatusColorDirective,

    MaterialModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  filterForm: FormGroup = this.formBuilder.group({
    fromDate: [null],
    toDate: [null],
    statuses: [[]]
  });;
  readonly statusOptions: `${OrderStatus}`[] = Object.values(OrderStatus);

  private readonly bPagination: BehaviorSubject<IPagination> = new BehaviorSubject<IPagination>(paginationConstant);
  pagination$ = this.bPagination.asObservable();

  private readonly bFilterValue: BehaviorSubject<IOrderFilterParams> = new BehaviorSubject<IOrderFilterParams>(this.filterForm.value);
  filterValue$ = this.bFilterValue.asObservable();

  private orderResponse$ = combineLatest([this.filterValue$, this.pagination$.pipe(
    distinctUntilChanged((prev, curr) => prev.page === curr.page && prev.size === curr.size)
  )]).pipe(
    switchMap(([filterValues, paginationParams]) => {
      return this.orderService.getOrders(filterValues, paginationParams.page, paginationParams.size)
    })
  );

  orders$ = this.orderResponse$.pipe(
    map(response => {
      const { data, paging } = response;
      const pagination: IPagination = {
        page: paging.page,
        size: paging.size,
        totalItems: paging.totalItems,
        totalPages: paging.totalPages
      };

      this.bPagination.next(pagination);
      return data;
    })
  );

  isMobile$ = this.breakpointDetectionService.isMobile$;

  displayedColumns: string[] = ['code', 'orderFrom', 'createdAt', 'status', 'total', 'actions'];

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private readonly breakpointDetectionService: BreakpointDetectionService
  ) { }

  ngOnInit() {
  }

  submit() {
    if (this.filterForm.valid) {
      this.bFilterValue.next(this.filterForm.value);
    }
  }

  resetFilter() {
    this.filterForm.reset({
      fromDate: null,
      toDate: null,
      statuses: []
    });
  }

  handlePageEvent(event: PageEvent) {
    const currentPagination = this.bPagination.getValue();

    currentPagination.page = event.pageIndex + 1;
    currentPagination.size = event.pageSize;

    this.bPagination.next(currentPagination);
  }
}
