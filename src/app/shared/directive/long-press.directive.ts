import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]',
  standalone: true
})
export class LongPressDirective {
  @Input() pressDuration: number = 500; // Duration in milliseconds
  @Output() longPress = new EventEmitter<MouseEvent>();
  @Output() longTouch = new EventEmitter<TouchEvent>();
  private timeout: any;
  private isPressing: boolean = false;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isPressing = true;
    this.timeout = setTimeout(() => {
      if (this.isPressing) {
        if (event instanceof TouchEvent) {
          this.longTouch.emit(event as TouchEvent);
        } else{
          this.longPress.emit(event as MouseEvent);
        }
      }
    }, this.pressDuration);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchmove')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUpOrLeave(): void {
    this.isPressing = false;
    clearTimeout(this.timeout);
  }
}
