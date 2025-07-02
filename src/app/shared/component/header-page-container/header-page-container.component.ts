import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header-page-container',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header-page-container.component.html',
  styleUrl: './header-page-container.component.scss'
})
export class HeaderPageContainerComponent {
  @Input() title: string = '';

  @Output() goBack: EventEmitter<null> = new EventEmitter<null>();
}
