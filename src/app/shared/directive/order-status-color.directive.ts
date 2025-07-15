import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { OrderStatus } from '../constant/order.constant';

@Directive({
  selector: '[appOrderStatusColor]',
  standalone: true
})
export class OrderStatusColorDirective implements OnChanges {

  @Input('appOrderStatusColor') status!: `${OrderStatus}`; // Trạng thái đơn hàng

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    let color = '';
    switch (this.status) {
      case OrderStatus.PENDING:
        color = '#FFA000'; // Vàng cam
        break;
      case OrderStatus.CONFIRMED:
        color = '#1976D2'; // Xanh dương đậm
        break;
      case OrderStatus.SHIPPING:
        color = '#00BCD4'; // Xanh ngọc
        break;
      case OrderStatus.COMPLETED:
        color = '#388E3C'; // Xanh lá đậm
        break;
      case OrderStatus.CANCELED:
        color = '#D32F2F'; // Đỏ đậm
        break;
      default:
        color = '#616161'; // Xám
    }
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
  }

}
