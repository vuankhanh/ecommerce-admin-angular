import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGallery]',
  standalone: true,
})
export class GalleryDomManipulatorDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const galleryElement = this.el.nativeElement;
    const viewer = galleryElement.getElementsByTagName('viewer')[0];

    // Thêm lớp CSS tùy chỉnh vào viewer
    this.renderer.addClass(viewer, 'custom-viewer-16-9');
  }
}
