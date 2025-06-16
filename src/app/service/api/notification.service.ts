import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private url: string = environment.backendApi + '/notification';
  constructor(
    private httpClient: HttpClient
  ) { }

  webContentUpdate() {
    return this.httpClient.post(this.url+'/web-content-update', {});
  }

  serviceReloadApplication() {
    return this.httpClient.post(this.url+'/service-reload-application', {});
  }
}
