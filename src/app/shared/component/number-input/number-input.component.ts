import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OnlyNumberDirective } from '../../directive/only-number.directive';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [
    OnlyNumberDirective,

    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent {
  @Input() value: number = 1;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  increment() {
    if (this.value < 999) {
      this.value++;
      this.valueChange.emit(this.value);
    }
  }

  decrement() {
    if (this.value > 1) {
      this.value--;
      this.valueChange.emit(this.value);
    }
  }

  onInputChange(event: any) {
    let value = event.target.value;
    if (value === '' || value === '0') {
      value = 1;
    }
    this.value = Number(value);
    this.valueChange.emit(this.value);
  }
}
