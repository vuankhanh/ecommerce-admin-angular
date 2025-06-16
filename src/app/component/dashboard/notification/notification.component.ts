import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../service/api/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  constructor(
    private notificationService: NotificationService
  ) { }
  
  webContentUpdate(){
    this.subscription.add(
      this.notificationService.webContentUpdate().subscribe(res=>{
        console.log(res);
      })
    )
  }

  serviceReloadApplication(){
    this.subscription.add(
      this.notificationService.serviceReloadApplication().subscribe(res=>{
        console.log(res);
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
