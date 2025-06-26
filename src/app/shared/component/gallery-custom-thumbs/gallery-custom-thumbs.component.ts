import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { GalleryComponent, GalleryItem, GalleryItemEvent } from '@daelmaak/ngx-gallery';
import { GalleryDomManipulatorDirective } from '../../directive/gallery-dom-manipulator.directive';
import { concat, map, Observable, Subscription } from 'rxjs';
import { LongPressDirective } from '../../directive/long-press.directive';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { IGalleryItem } from '../../interface/gallery.interface';

@Component({
  selector: 'app-gallery-custom-thumbs',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,

    MatMenuModule,
    MatIconModule,

    GalleryComponent,

    GalleryDomManipulatorDirective,
    LongPressDirective
  ],
  templateUrl: './gallery-custom-thumbs.component.html',
  styleUrl: './gallery-custom-thumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryCustomThumbsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GalleryComponent) galleryComponent!: GalleryComponent;
  @ViewChild(MatMenuTrigger) matMenuTrigger!: MatMenuTrigger;
  @ViewChild('thumbsElement') thumbsElement!: ElementRef<HTMLDivElement>;

  @Input() items: IGalleryItem[] = [];
  @Input() selectedIndex: number = 0;

  @Output() itemClickEvent: EventEmitter<GalleryItemEvent> = new EventEmitter<GalleryItemEvent>();
  @Output() thumbsClickEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() indexChangeEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemTemporaryDeletionEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemIndexChangedEvent: EventEmitter<IGalleryItem[]> = new EventEmitter<IGalleryItem[]>();
  // @Output() itemHighLightEvent: EventEmitter<string> = new EventEmitter<string>();

  itemTemporaryDeletions: number[] = [];
  menuTopLeftPosition = { x: '0', y: '0' };

  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    console.log(this.items);
    
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      this.indexChange$.subscribe(index => {
        this.scrollToChild(index);
        this.selectedIndex = index;
        this.indexChangeEvent.emit(index);
      })
    )
  }

  get indexChange$(): Observable<number> {
    const index = this.galleryComponent.selectedIndex;
    return concat(
      new Observable<number>(observer => {
        observer.next(index);
        observer.complete();
      }),
      this.galleryComponent.selection.asObservable().pipe(
        map(_ => this.galleryComponent.selectedIndex)
      )
    );
  }

  private scrollToChild(childIndex: number): void {
    const thumbsElement = this.thumbsElement.nativeElement;
    const childs = thumbsElement.children;

    if (thumbsElement) {
      const child = childs[childIndex];
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      } else {
        console.error('Child element not found');
      }
    } else {
      console.error('thumbsElement not found');
    }
  }

  onGalleryLongTouch(event: TouchEvent): void {
    this.openMenuAt(event.touches[0].clientX, event.touches[0].clientY);
  }

  onGalleryLongPress(event: MouseEvent): void {
    this.openMenuAt(event.clientX, event.clientY);
  }

  private openMenuAt(x: number, y: number): void {
    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = x + 'px';
    this.menuTopLeftPosition.y = y + 'px';
    // we open the menu 
    this.matMenuTrigger.openMenu();
  }

  itemTemporaryDeletion() {
    this.itemTemporaryDeletionEvent.emit(this.selectedIndex);
  }

  drop(event: CdkDragDrop<GalleryItem[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.items = [...this.items];
    this.itemIndexChangedEvent.emit(this.items);
  }

  onItemGallerySelection(event: GalleryItemEvent): void {
    this.itemClickEvent.emit(event);
  }

  thumbsClick(index: number): void {
    this.thumbsClickEvent.emit(index);
    this.selectedIndex = index;
    this.galleryComponent.select(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
