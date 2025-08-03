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
    let bgColor = '';
    let color = '#fff';
    switch (this.status) {
      case OrderStatus.PENDING:
        bgColor = '#FFA000'; // Vàng cam
        color = '#fff';
        break;
      case OrderStatus.CONFIRMED:
        bgColor = '#1976D2'; // Xanh dương đậm
        color = '#fff';
        break;
      case OrderStatus.SHIPPING:
        bgColor = '#00BCD4'; // Xanh ngọc
        color = '#fff';
        break;
      case OrderStatus.COMPLETED:
        bgColor = '#388E3C'; // Xanh lá đậm
        color = '#fff';
        break;
      case OrderStatus.CANCELED:
        bgColor = '#D32F2F'; // Đỏ đậm
        color = '#fff';
        break;
      default:
        bgColor = '#E0E0E0'; // Xám nhạt
        color = '#333';
    }
    const chip = this.el.nativeElement.querySelector('mat-chip');
    if (chip) {
      this.renderer.setStyle(chip, 'background-color', bgColor);
      this.renderer.setStyle(chip, 'font-weight', 'bold');
      // Set color cho text-label bên trong chip
      const textLabel = chip.querySelector('.mdc-evolution-chip__text-label');
      if (textLabel) {
        this.renderer.setStyle(textLabel, 'color', color);
      }
    }
  }
}
