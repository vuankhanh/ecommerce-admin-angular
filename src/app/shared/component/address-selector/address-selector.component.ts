import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BehaviorSubject, distinctUntilChanged, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { isEqual } from 'lodash';
import { MaterialModule } from '../../modules/material';
import { IDistrict, IProvince, IWard } from '../../interface/vn-public-apis.interface';
import { IAddress } from '../../interface/address.interface';
import { VnPublicService } from '../../../service/api/vn-public.service';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './address-selector.component.html',
  styleUrl: './address-selector.component.scss'
})
export class AddressSelectorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() address!: IAddress;
  @Output() addressValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() valueChange: EventEmitter<IAddress> = new EventEmitter<IAddress>();
  @ViewChild('provinceEl') provinceEl!: ElementRef<MatInput>;
  @ViewChild('districtEl') districtEl!: ElementRef<MatInput>;
  @ViewChild('wardEl') wardEl!: ElementRef<MatInput>;
  @ViewChild('streetEl') streetEl!: ElementRef<MatInput>;

  private readonly renderer = inject(Renderer2)
  private readonly fb = inject(FormBuilder);
  private readonly vnPublicService = inject(VnPublicService);
  addressForm: FormGroup;
  provinces$: Observable<IProvince[]> = of([]);
  districts$: Observable<IDistrict[]> = of([]);
  wards$: Observable<IWard[]> = of([]);

  bProvinceInputChange = new BehaviorSubject<string>('');
  bDistrictInputChange = new BehaviorSubject<string>('');
  bWardInputChange = new BehaviorSubject<string>('');

  private subscription: Subscription = new Subscription();
  constructor() {
    this.addressForm = this.fb.group({
      province: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
      street: ['', Validators.required],
    });

    this.subscription.add(
      this.addressForm.valueChanges.pipe(
        distinctUntilChanged((prev, curr) =>{
          return isEqual(prev, curr)
        })
      ).subscribe(value => {
        this.addressValidChange.emit(this.addressForm.valid);
        this.valueChange.emit(value);
      })
    )
  }

  get provinceControl() {
    return this.addressForm.get('province')!;
  }

  get districtControl() {
    return this.addressForm.get('district')!;
  }

  get wardControl() {
    return this.addressForm.get('ward')!;
  }

  get streetControl() {
    return this.addressForm.get('street')!;
  }

  ngOnInit(): void {
    this.setProvince$();

    this.provinceControl.setValue(this.address?.province);
    this.districtControl.setValue(this.address?.district);
    this.wardControl.setValue(this.address?.ward);
    this.streetControl.setValue(this.address?.street);
  }

  onProvinceOptionSelected(event: MatAutocompleteSelectedEvent) {
    const plainProvnce = {...event.option.value};

    const province: IProvince = plainProvnce;
    this.provinceEl.nativeElement.value = province.name;
    this.districtEl.nativeElement.value = null;
    this.wardEl.nativeElement.value = null;

    this.provinceControl.setValue(province);
    this.setDistrict$(province.code);
    this.districtControl.setValue(null);
    this.wardControl.setValue(null);
  }

  onDistrictOptionSelected(event: MatAutocompleteSelectedEvent) {
    const district: IProvince = event.option.value;
    this.districtEl.nativeElement.value = district.name;
    this.wardEl.nativeElement.value = null;

    this.districtControl.setValue(district);
    this.setWard$(district.code);
    this.wardControl.setValue(null);
  }

  onWardOptionSelected(event: MatAutocompleteSelectedEvent) {
    const ward: IProvince = event.option.value;
    this.wardEl.nativeElement.value = ward.name;

    this.wardControl.setValue(ward);
  }

  private setProvince$() {
    this.provinces$ = this.vnPublicService.getProvinces().pipe(
      switchMap((provinces: IProvince[]) => this.bProvinceInputChange.pipe(
        startWith(''),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return provinces.filter((province: IProvince) => province.name.toLowerCase().includes(filterValue));
        })
      ))
    );
  }

  private setDistrict$(provinceCode: string) {
    this.districts$ = this.vnPublicService.getDistricts(provinceCode).pipe(
      switchMap((districts: IDistrict[]) => this.bDistrictInputChange.pipe(
        startWith(''),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return districts.filter((district: IDistrict) => district.name.toLowerCase().includes(filterValue));
        })
      ))
    );
  }

  private setWard$(districtCode: string) {
    this.wards$ = this.vnPublicService.getWards(districtCode).pipe(
      switchMap((wards: IWard[]) => this.bWardInputChange.pipe(
        startWith(''),
        map((value: string) => {
          const filterValue = value.toLowerCase();
          return wards.filter((ward: IWard) => ward.name.toLowerCase().includes(filterValue));
        })
      ))
    );
  }

  ngAfterViewInit(): void {
    this.provinceEl.nativeElement.value = this.address?.province?.name || '';
    this.districtEl.nativeElement.value = this.address?.district?.name || '';
    this.wardEl.nativeElement.value = this.address?.ward?.name || '';

    this.renderer.listen(this.provinceEl.nativeElement, 'input', (event: InputEvent ) => {
      this.bProvinceInputChange.next(this.provinceEl.nativeElement.value);
    });
  
    this.renderer.listen(this.districtEl.nativeElement, 'input', () => {
      this.bDistrictInputChange.next(this.districtEl.nativeElement.value);
    });
  
    this.renderer.listen(this.wardEl.nativeElement, 'input', () => {
      this.bWardInputChange.next(this.wardEl.nativeElement.value);
    });
  }

  onProvinceBlur(event: FocusEvent) {
    const provinceName: string = this.provinceControl.value?.name;
    this.provinceEl.nativeElement.value = provinceName ? provinceName : '';
  }

  onDistrictBlur(event: FocusEvent) {
    const districtName: string = this.districtControl.value?.name;
    this.districtEl.nativeElement.value = districtName ? districtName : '';
  }

  onWardBlur(event: FocusEvent) {
    const wardName: string = this.wardControl.value?.name;
    this.wardEl.nativeElement.value = wardName ? wardName : '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
