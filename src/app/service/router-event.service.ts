import { Injectable, Injector, runInInjectionContext, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ResolveFn, Router } from '@angular/router';
import { concat, filter, map, Observable, of, switchMap, tap, from, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterEventService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private titleObserver?: MutationObserver;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.titleObserver?.disconnect();
  }

  getRouteTitle$(): Observable<string> {
    return this.getTitleFromDOM$();
  }

  // Lắng nghe title change từ DOM
  private getTitleFromDOM$(): Observable<string> {
    return new Observable<string>(observer => {
      // Emit giá trị hiện tại
      observer.next(document.title);

      // Tạo MutationObserver để lắng nghe thay đổi title
      this.titleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            observer.next(document.title);
          }
        });
      });

      // Quan sát thay đổi trong thẻ title
      const titleElement = document.querySelector('title');
      if (titleElement) {
        this.titleObserver.observe(titleElement, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }

      // Cleanup khi unsubscribe
      return () => {
        this.titleObserver?.disconnect();
      };
    }).pipe(
      takeUntil(this.destroy$)
    );
  }

  // Method cũ với route resolution (backup)
  getRouteTitleFromRoute$(): Observable<string> {
    return concat(
      this.resolveTitle(this.getChildRoute(this.activatedRoute)),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getChildRoute(this.activatedRoute)),
        tap(route => {
          console.log(route.routeConfig);
        }),
        switchMap(route => this.resolveTitle(route))
      )
    );
  }

  private resolveTitle(route: ActivatedRoute): Observable<string> {
    const title = route.routeConfig?.title;
    
    if (!title) {
      return of('');
    }
    
    // Nếu title là string
    if (typeof title === 'string') {
      return of(title);
    }
    
    // Nếu title là ResolveFn<string>
    if (typeof title === 'function') {
      const resolveFn = title as ResolveFn<string>;
      
      // Sử dụng runInInjectionContext để cung cấp injection context
      const resolvedTitle = runInInjectionContext(this.injector, () => 
        resolveFn(route.snapshot, this.router.routerState.snapshot)
      );
      
      // Nếu resolve function trả về Observable
      if (resolvedTitle instanceof Observable) {
        return resolvedTitle;
      }
      
      // Nếu resolve function trả về Promise
      if (resolvedTitle instanceof Promise) {
        return from(resolvedTitle);
      }
      
      // Nếu resolve function trả về string trực tiếp
      return of(resolvedTitle as string);
    }
    
    return of('');
  }

  private getChildRoute(route: ActivatedRoute) {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}