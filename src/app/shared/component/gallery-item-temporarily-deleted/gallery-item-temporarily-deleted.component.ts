import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { IGalleryItem } from '../../interface/gallery.interface';

@Component({
  selector: 'app-gallery-item-temporarily-deleted',
  standalone: true,
  imports: [
    CommonModule,

    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './gallery-item-temporarily-deleted.component.html',
  styleUrl: './gallery-item-temporarily-deleted.component.scss'
})
export class GalleryItemTemporarilyDeletedComponent {
  @ViewChild(MatMenuTrigger) matMenuTrigger!: MatMenuTrigger;

  @Input() galleryItemTemporarilyDeleted: IGalleryItem[] = [];
  @Output() galleryItemRestore: EventEmitter<IGalleryItem> = new EventEmitter<IGalleryItem>();

  menuTopLeftPosition = { x: '0', y: '0' };

  onTemporaryDeletionGalleryRightClick(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.openMenuAt(event.clientX, event.clientY, { itemIndex: index });
  }

  restoreItemTemporaryDeletion(index: number): void {
    const item = this.galleryItemTemporarilyDeleted[index];
    this.galleryItemRestore.emit(item);
    this.galleryItemTemporarilyDeleted.splice(index, 1);
  }

  private openMenuAt(x: number, y: number, data: { itemIndex: number }): void {
    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = x + 'px';
    this.menuTopLeftPosition.y = y + 'px';
    this.matMenuTrigger.menuData = { data };
    // we open the menu 
    this.matMenuTrigger.openMenu();
  }
}
