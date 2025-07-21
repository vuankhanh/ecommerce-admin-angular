import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const patterns = [
  // Số bắt đầu bằng 0 (10 số)
  /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
  // Số bắt đầu bằng +84 (12 ký tự)
  /^\+84(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
  // Số bắt đầu bằng 84 (11 số)
  /^84(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/
];

export function vietnamesePhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Nếu không có giá trị thì không validate (để cho required validator xử lý)
    if (!value) {
      return null;
    }

    // Loại bỏ khoảng trắng và các ký tự đặc biệt (trừ +)
    const cleanedValue = value.replace(/[\s\-\.]/g, '');
    
    // Kiểm tra xem có khớp với bất kỳ pattern nào không
    const isValid = patterns.some(pattern => pattern.test(cleanedValue));
    
    return isValid ? null : { vietnamesePhoneNumber: { value: control.value } };
  };
}

// Export thêm function để kiểm tra phone number
export function isValidVietnamesePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  const cleanedValue = phoneNumber.replace(/[\s\-\.]/g, '');
  return patterns.some(pattern => pattern.test(cleanedValue));
}