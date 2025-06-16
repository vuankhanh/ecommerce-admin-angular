import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LocalStorageService } from '../../../service/local-storage.service';
import { LocalStorageKey } from '../../constant/local_storage.constant';
import { JwtDecodedService } from '../../../service/jwt-decoded.service';
import { JwtPayload } from 'jwt-decode';

export const jwtPayloadResolver: ResolveFn<JwtPayload | null> = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const jwtDecodedService = inject(JwtDecodedService);
  const token = localStorageService.get(LocalStorageKey.TOKEN);
  if (!token || !token.accessToken) {
    return null;
  }

  const jwtPayload = jwtDecodedService.jwtDecoded(token.accessToken);
  if (!jwtPayload) return null
  return jwtPayload;
};
