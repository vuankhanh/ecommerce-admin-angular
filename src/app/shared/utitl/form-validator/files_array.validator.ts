import { AbstractControl, ValidationErrors } from '@angular/forms';

export function filesArrayValidator(control: AbstractControl): ValidationErrors | null {
  const files = control.value;
  if (Array.isArray(files) && files.length > 0 && files.every(file => file instanceof File)) {
    return null; // Valid
  }
  return { filesArrayInvalid: true }; // Invalid
}