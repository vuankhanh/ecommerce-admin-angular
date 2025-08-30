import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TOrderStatus } from '../../interface/order-response.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material';
import { OrderStatusTransition } from '../../constant/order.constant';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { OrderStatusColorDirective } from '../../directive/order-status-color.directive';

@Component({
  selector: 'app-status-selector',
  standalone: true,
  imports: [
    CommonModule,

    ReactiveFormsModule,

    OrderStatusColorDirective,

    MaterialModule
  ],
  templateUrl: './status-selector.component.html',
  styleUrl: './status-selector.component.scss'
})
export class StatusSelectorComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<StatusSelectorComponent>);
  readonly data = inject<TOrderStatus | null>(MAT_DIALOG_DATA);

  private readonly bStatuses: BehaviorSubject<TOrderStatus[]> = new BehaviorSubject<TOrderStatus[]>([]);
  readonly statuses$ = this.bStatuses.asObservable();

  statusControl: FormControl = new FormControl<TOrderStatus | null>(null, Validators.required);

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    if (!this.data) {
      throw new Error('Status is required');
    }
    const statuses = OrderStatusTransition[this.data] || [];
    this.bStatuses.next(statuses);
    this.statusControl.setValue(this.data);
    this.statusControl.setValidators([this.newStatusNotEqualValidator(this.data)]);
    this.cdr.detectChanges();
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
