import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileDragAndDropComponent } from '../../../../shared/component/file-drag-and-drop/file-drag-and-drop.component';
import { Subscription } from 'rxjs';
import { HightlightMarketingService } from '../../../../service/api/hightlight-marketing.service';
import { IRequestParamsWithFiles } from '../../../../shared/interface/request.interface';
import { PrefixBackendStaticPipe } from '../../../../shared/pipe/prefix-backend.pipe';
import { TMediaModel } from '../../../../shared/interface/album.interface';

@Component({
  selector: 'app-hightlight-marketing',
  standalone: true,
  imports: [
    PrefixBackendStaticPipe,
    FileDragAndDropComponent
  ],
  templateUrl: './hightlight-marketing.component.html',
  styleUrl: './hightlight-marketing.component.scss'
})
export class HightlightMarketingComponent implements OnInit, OnDestroy {
  @ViewChild(FileDragAndDropComponent) childComponentRef!: FileDragAndDropComponent;
  hightlightMarketing?: TMediaModel;

  imageMIMETypes: Array<string> = ['image/png', 'image/jpeg', 'image/jpg'];

  subscription: Subscription = new Subscription();
  constructor(
    private hightlightMarketingService: HightlightMarketingService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.hightlightMarketingService.get().subscribe((hightlightMarketing) => {
        this.hightlightMarketing = hightlightMarketing;
      })
    )
  }

  handleFilesUploaded(params: IRequestParamsWithFiles): void {
    const api = this.hightlightMarketing ? this.updateRequest(params) : this.createRequest(params);
    this.subscription.add(
      api.subscribe((hightlightMarketing) => {
        this.childComponentRef.isEditing = true;
        this.hightlightMarketing = hightlightMarketing;
      })
    )
  }

  private createRequest(params: IRequestParamsWithFiles){
    return this.hightlightMarketingService.create(params.alternateName, params.description, params.files[0]);
  }

  private updateRequest(params: IRequestParamsWithFiles){
    return this.hightlightMarketingService.update(params.alternateName, params.description, params.files[0]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
