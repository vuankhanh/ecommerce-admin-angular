import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TPaymentMethod } from '../../interface/payment.interface';
import { PaymentMethod } from '../../constant/payment.constant';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-payment-method-selector',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './payment-method-selector.component.html',
  styleUrl: './payment-method-selector.component.scss'
})
export class PaymentMethodSelectorComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PaymentMethodSelectorComponent>);
  readonly data = inject<TPaymentMethod | null>(MAT_DIALOG_DATA);

  paymentMethods: TPaymentMethod[] = Object.values(PaymentMethod);

  paymentMethodControl: FormControl = new FormControl<TPaymentMethod | null>(null);

  ngOnInit(): void {
    if (!this.data) {
      throw new Error('Payment method is required');
    }
    this.paymentMethodControl.setValue(this.data);
    this.paymentMethodControl.setValidators([this.newPaymentMethodNotEqualValidator(this.data)]);
  }

  private newPaymentMethodNotEqualValidator(paymentMethod: TPaymentMethod): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value == paymentMethod
        ? { paymentMethodNotChanged: true }
        : null;
    };
  }

  choosePaymentMethod() {
    if (this.paymentMethodControl.invalid) {
      return;
    }
    this.dialogRef.close(this.paymentMethodControl.value);
  }
}
