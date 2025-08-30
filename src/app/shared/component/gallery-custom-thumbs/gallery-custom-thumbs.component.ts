import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { GalleryComponent, GalleryItem, GalleryItemEvent } from '@daelmaak/ngx-gallery';
import { GalleryDomManipulatorDirective } from '../../directive/gallery-dom-manipulator.directive';
import { concat, map, Observable, Subscription } from 'rxjs';
import { LongPressDirective } from '../../directive/long-press.directive';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { IGalleryItem } from '../../interface/gallery.interface';
import { MatDialog } from '@angular/material/dialog';
import { SlidesComponent } from '../slides/slides.component';

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

  @Output() thumbsClickEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() indexChangeEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemTemporaryDeletionEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemIndexChangedEvent: EventEmitter<IGalleryItem[]> = new EventEmitter<IGalleryItem[]>();
  // @Output() itemHighLightEvent: EventEmitter<string> = new EventEmitter<string>();

  itemTemporaryDeletions: number[] = [];
  menuTopLeftPosition = { x: '0', y: '0' };

  private subscription: Subscription = new Subscription();

  private readonly matDialog: MatDialog = inject(MatDialog);

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
        map(() => this.galleryComponent.selectedIndex)
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

  // onItemGallerySelection(event: GalleryItemEvent): void {
  //   this.itemClickEvent.emit(event);
  // }

  thumbsClick(index: number): void {
    this.thumbsClickEvent.emit(index);
    this.selectedIndex = index;
    this.galleryComponent.select(index);
  }

  onThumbKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.thumbsClick(index);
      event.preventDefault();
    }
  }

  selection(event: GalleryItemEvent) {
    const data = {
      metaData: this.items,
      selection: event.index
    }

    const dialog = this.matDialog.open(SlidesComponent, {
      id: '',
      data: data,
      minWidth: '100%',
      minHeight: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    })
    this.subscription.add(
      dialog.afterOpened().subscribe(()=> history.pushState(null, ''))
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
