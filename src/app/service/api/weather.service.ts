import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IWeatherResponse, TWeatherData } from '../../shared/interface/weather.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private url: string = environment.backendApi+'/open-weather';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getNextHourWeather(): Observable<TWeatherData> {
    return this.httpClient.get<IWeatherResponse>(this.url+'/next-hour').pipe(
      map((response: IWeatherResponse) => response.metaData)
    );
  }

  getWeatherIcon(icon: string) {
    let params = new HttpParams();
    params = params.append('icon', icon);

    return this.httpClient.get(this.url+'/icon', { params, responseType: 'blob' }).pipe(
      map((response: Blob) => {
        // Create a URL for the blob object
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(new Blob([response], { type: 'image/png' }));
      })
    );
  }
}
