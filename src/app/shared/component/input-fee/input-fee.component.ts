import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInputFeeDialogData } from '../../interface/input-fee-dialog.interface';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input-fee',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    NgxMaskDirective,

    MaterialModule
  ],
  templateUrl: './input-fee.component.html',
  styleUrl: './input-fee.component.scss'
})
export class InputFeeComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<InputFeeComponent>);
  readonly data = inject<IInputFeeDialogData>(MAT_DIALOG_DATA);

  feeControl: FormControl = new FormControl('')
  onNoClick() { }

  ngOnInit(): void {
    this.feeControl.setValue(this.data.fee ?? 0);
    this.feeControl.setValidators([this.feeNotEqualValidator(this.data.fee ?? 0)]);
  }

  private feeNotEqualValidator(oldFee: number): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value == oldFee
      ? { feeNotChanged: true }
      : null;
  };
}

  updateFee() {
    if (this.feeControl.valid) {
      this.dialogRef.close(this.feeControl.value);
    } else {
      this.feeControl.markAsTouched();
    }
  }
}
