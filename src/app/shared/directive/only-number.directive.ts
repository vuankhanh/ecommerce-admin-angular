import { Directive, ElementRef, HostListener, Input, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumber]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OnlyNumberDirective),
    multi: true
  }]
})
export class OnlyNumberDirective implements ControlValueAccessor {
    /**
  Nếu limitedValue = true thì chỉ cho phép nhập số từ 1 đến 999.
  Còn nếu limitedValue = false thì không giới hạn giá trị nhập vào. Mặc định là true.
  */
  @Input() limitedValue: boolean = true;
  @Input() allowZero: boolean = false;
  private onChange: (value: number) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    if(!this.allowZero){
      // Remove leading zeros
      value = value.replace(/^0+/, '');
    }

    if (this.limitedValue && Number(value) > 999) {
      value = '999'; // Limit to 999
    }

    this.renderer.setProperty(target, 'value', value);
    this.onChange(Number(value)); // Set value as number
  }

  @HostListener('blur', ['$event']) onBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
    if(!this.allowZero){
      if (value === '' || value === '0') {
        value = '1'; // Auto fill 1 if empty or 0
      }
    }else{
      if (value === ''){
        value = '0';
      }
    }

    this.renderer.setProperty(target, 'value', value);
    this.onChange(Number(value)); // Set value as number
    
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';

    if (!/^\d+$/.test(pastedText) || Number(pastedText) > 999) {
      event.preventDefault(); // Prevent paste if not a valid number or greater than 999
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric characters
    }
  }

  writeValue(value: number): void {
    this.renderer.setProperty(this.el.nativeElement, 'value', value);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }
}