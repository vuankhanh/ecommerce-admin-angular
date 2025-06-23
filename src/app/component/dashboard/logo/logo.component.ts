import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { LogoService } from '../../../service/api/logo.service';
import { Subscription } from 'rxjs';
import { IImage } from '../../../shared/interface/media.interface';
import { PrefixBackendStaticPipe } from '../../../shared/pipe/prefix-backend.pipe';
import { IRequestParamsWithFiles } from '../../../shared/interface/request.interface';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    PrefixBackendStaticPipe,
    FileDragAndDropComponent
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent implements OnInit, OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  logo?: IImage;

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];

  subscription: Subscription = new Subscription();
  constructor(
    private logoService: LogoService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.logoService.get().subscribe((logo) => {
        this.logo = logo;
      })
    )
  }

  handleFilesUploaded(params: IRequestParamsWithFiles): void {
    console.log(params);
    const api = this.logo ? this.updateRequest(params) : this.createRequest(params);
    this.subscription.add(
      api.subscribe((logo) => {
        this.childComponentRef.isEditing = true;
        this.logo = logo;
      })
    )
  }

  private createRequest(params: IRequestParamsWithFiles){
    return this.logoService.create(params.alternateName, params.description, params.files[0]);
  }

  private updateRequest(params: IRequestParamsWithFiles){
    return this.logoService.update(params.alternateName, params.description, params.files[0]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
