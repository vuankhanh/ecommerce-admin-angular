import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  constructor(
    private router: Router
  ) { }

  get isLogin(): boolean{
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken ? true : false;
  }
  
  logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
