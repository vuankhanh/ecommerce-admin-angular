import { Component, Input } from '@angular/core';
import { IJwtDecoded } from '../../interface/user_information.interface';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-header',
  standalone: true,
  imports: [
    CommonModule,

    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss'
})
export class MenuHeaderComponent {
  @Input() user!: IJwtDecoded;
}
