import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function filesArrayValidator(control: AbstractControl): ValidationErrors | null {
  if (!(control instanceof FormArray)) {
    return null;
  }
  
  const formArray = control as FormArray;

  // Kiểm tra length > 0
  if (formArray.length === 0) {
    return { minLength: { requiredLength: 1, actualLength: 0 } };
  }

  // Kiểm tra cấu trúc từng phần tử
  for (let i = 0; i < formArray.length; i++) {
    const formGroup = formArray.at(i) as FormGroup;

    if (!formGroup) {
      return { invalidStructure: { index: i, message: 'Form group is null' } };
    }

    // Kiểm tra các field bắt buộc
    const requiredFields = ['file', 'description', 'alternateName', 'isMain'];
    for (const field of requiredFields) {
      if (!formGroup.get(field)) {
        return {
          invalidStructure: {
            index: i,
            message: `Missing required field: ${field}`
          }
        };
      }
    }

    // Kiểm tra kiểu dữ liệu
    const fileControl = formGroup.get('file');
    const descriptionControl = formGroup.get('description');
    const alternateNameControl = formGroup.get('alternateName');
    const isMainControl = formGroup.get('isMain');

    if (fileControl?.value && !(fileControl.value instanceof File)) {
      return {
        invalidType: {
          index: i,
          field: 'file',
          message: 'File must be instance of File'
        }
      };
    }

    if (descriptionControl?.value && typeof descriptionControl.value !== 'string') {
      return {
        invalidType: {
          index: i,
          field: 'description',
          message: 'Description must be string'
        }
      };
    }

    if (alternateNameControl?.value && typeof alternateNameControl.value !== 'string') {
      return {
        invalidType: {
          index: i,
          field: 'alternateName',
          message: 'AlternateName must be string'
        }
      };
    }

    if (isMainControl?.value && typeof isMainControl.value !== 'boolean') {
      return {
        invalidType: {
          index: i,
          field: 'isMain',
          message: 'IsMain must be boolean'
        }
      };
    }
  }

  return null;
}

//Viết cho tôi fileValidator giống như filesArrayValidator nhưng chỉ kiểm tra xem file có phải là instance của File hay không
export function fileValidator(control: AbstractControl): ValidationErrors | null {
  if (!(control instanceof FormGroup)) {
    return null;
  }
  
  // Kiểm tra các field bắt buộc
  const requiredFields = ['file', 'description', 'alternateName', 'isMain'];
  for (const field of requiredFields) {
    if (!control.get(field)) {
      return {
        invalidStructure: {
          message: `Missing required field: ${field}`
        }
      };
    }
  }

  // Kiểm tra kiểu dữ liệu
  const fileControl = control.get('file');
  const descriptionControl = control.get('description');
  const alternateNameControl = control.get('alternateName');
  const isMainControl = control.get('isMain');

  if (fileControl?.value && !(fileControl.value instanceof File)) {
    return {
      invalidType: {
        field: 'file',
        message: 'File must be instance of File'
      }
    };
  }

  if (descriptionControl?.value && typeof descriptionControl.value !== 'string') {
    return {
      invalidType: {
        field: 'description',
        message: 'Description must be string'
      }
    };
  }

  if (alternateNameControl?.value && typeof alternateNameControl.value !== 'string') {
    return {
      invalidType: {
        field: 'alternateName',
        message: 'AlternateName must be string'
      }
    };
  }

  if (isMainControl?.value && typeof isMainControl.value !== 'boolean') {
    return {
      invalidType: {
        field: 'isMain',
        message: 'IsMain must be boolean'
      }
    };
  }

  return null;
}