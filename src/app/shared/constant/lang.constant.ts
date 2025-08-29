import { InjectionToken } from "@angular/core";

export enum Language {
  VI = 'vi',
  EN = 'en',
  JA = 'ja'
}

export const APP_LANGUAGE = new InjectionToken<`${Language}`>('APP_LANGUAGE');