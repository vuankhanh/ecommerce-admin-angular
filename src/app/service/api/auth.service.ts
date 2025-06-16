import { Injectable } from '@angular/core';
import { IRefreshTokenResponse, ITokenResponse, Token } from '../../shared/interface/token.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IAdminConfigResponse, IConfig } from '../../shared/interface/admin_config.interface';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.backendApi+'/auth';

  constructor(
    private httpClient: HttpClient,
  ) { }

  login(email: string, password: string): Observable<Token>{
    const data = { email, password }
    return this.httpClient.post<ITokenResponse>(this.url+'/login', data).pipe(
      map(res=>res.metaData)
    );
  }

  refreshToken(refreshToken: string): Observable<string>{
    const data = { refreshToken }
    return this.httpClient.post<IRefreshTokenResponse>(this.url+'/refresh_token', data).pipe(
      filter(res=>res.metaData ? true : false),
      map(res=>res.metaData.accessToken)
    );
  }

  checkToken(): Observable<IConfig>{
    return this.httpClient.post<IAdminConfigResponse>(this.url+'/config', null).pipe(
      map(res=>res.metaData)
    );
  }
}
