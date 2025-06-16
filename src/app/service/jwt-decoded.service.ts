import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtDecodedService {

  constructor() { }

  jwtDecoded(token: string){
    try {
      return jwtDecode(token);
    } catch (error) {
      console.log(error)
      return null;
    }
  }
}
