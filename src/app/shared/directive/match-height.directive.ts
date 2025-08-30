import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appMatchHeight]',
  standalone: true
})
export class MatchHeightDirective implements AfterViewInit, OnDestroy {
  private resizeObserver!: ResizeObserver;
  private mutationObserver!: MutationObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.setParentContainerHeight();
    this.observeChildElementResize();
    this.observeChildElementMutation();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private setParentContainerHeight() {
    const firstElementChild = this.el.nativeElement.firstElementChild as HTMLElement;
    if (firstElementChild) {
      const childHeight = firstElementChild.offsetHeight;
      this.el.nativeElement.style.height = `${childHeight}px`;
    }
  }

  private observeChildElementResize() {
    const firstElementChild = this.el.nativeElement.firstElementChild as HTMLElement;
    if (firstElementChild) {
      this.resizeObserver = new ResizeObserver(() => {
        this.setParentContainerHeight();
      });
      this.resizeObserver.observe(firstElementChild);
    }
  }

  private observeChildElementMutation() {
    this.mutationObserver = new MutationObserver(() => {
      this.setParentContainerHeight();
      this.observeChildElementResize(); // Re-observe the new firstElementChild
    });
    this.mutationObserver.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });
  }

}
