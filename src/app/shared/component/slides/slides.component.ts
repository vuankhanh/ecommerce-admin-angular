import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { Swiper } from 'swiper';
import { MaterialModule } from '../../modules/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PinchZoomComponent } from '@meddv/ngx-pinch-zoom';

register();

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    PinchZoomComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlidesComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  @ViewChildren(PinchZoomComponent) pinchZoomComponents!: QueryList<PinchZoomComponent>;
  currentIndex: number = 0;
  constructor(
    public dialogRef: MatDialogRef<SlidesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() { }

  ngAfterViewInit() {
    const swiperParams = {
      initialSlide: this.data.selection,
      zoom: true,
      on: {
        realIndexChange: (swiper: Swiper) => {
          this.realIndexChange(swiper);
        }
      },
    };

    Object.assign(this.swiper.nativeElement, swiperParams);
    this.swiper.nativeElement.initialize();
  }

  realIndexChange(swiper: Swiper) {
    this.currentIndex = swiper.realIndex;
  }
}
