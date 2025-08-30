import { APP_INITIALIZER } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

export function initializeIcons(
  matIconRegistry: MatIconRegistry
) {
  return () => {
    // Đăng ký Font Awesome
    matIconRegistry.registerFontClassAlias('fa', 'fa');
    matIconRegistry.registerFontClassAlias('fab', 'fab');
    matIconRegistry.registerFontClassAlias('fas', 'fas');
  };
}

export function provideIconConfig() {
  return {
    provide: APP_INITIALIZER,
    useFactory: initializeIcons,
    deps: [MatIconRegistry, DomSanitizer],
    multi: true
  };
}