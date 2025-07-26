import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TOrderStatus } from '../../interface/order-response.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material';
import { OrderStatus } from '../../constant/order.constant';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-selector',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './status-selector.component.html',
  styleUrl: './status-selector.component.scss'
})
export class StatusSelectorComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<StatusSelectorComponent>);
  readonly data = inject<TOrderStatus | null>(MAT_DIALOG_DATA);

  statuses: TOrderStatus[] = Object.values(OrderStatus);

  statusControl: FormControl = new FormControl<TOrderStatus | null>(null, Validators.required);

  ngOnInit(): void {
    if (!this.data) {
      throw new Error('Status is required');
    }
    this.statusControl.setValue(this.data);
    this.statusControl.setValidators([this.newStatusNotEqualValidator(this.data)]);
  }

  private newStatusNotEqualValidator(status: TOrderStatus): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value == status
        ? { statusNotChanged: true }
        : null;
    };
  }

  chooseStatus() {
    if (this.statusControl.invalid) {
      return;
    }
    this.dialogRef.close(this.statusControl.value);
  }
}
