import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-input-reason-order-cancelled',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MaterialModule
  ],
  templateUrl: './input-reason-order-cancelled.component.html',
  styleUrl: './input-reason-order-cancelled.component.scss'
})
export class InputReasonOrderCancelledComponent {
  readonly dialogRef = inject(MatDialogRef<InputReasonOrderCancelledComponent>);
  reasonControl = new FormControl<string>('', Validators.required);
}
