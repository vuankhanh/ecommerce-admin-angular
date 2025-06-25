import { Component, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { LogoService } from '../../../../service/api/logo.service';
import { Observable } from 'rxjs';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TMediaModel } from '../../../../shared/interface/album.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    CommonModule,
    
    PrefixBackendStaticPipe
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;

  mainLogo$: Observable<TMediaModel> = this.logoService.getMain();
  constructor(
    private logoService: LogoService
  ) {}
}
