import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { concat, filter, map, Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterEventService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  getRouteTitle$(): Observable<string> {
    const title = this.getChildRoute(this.activatedRoute).routeConfig?.title as string;
    
    return concat(
      new Observable<string>(observer => {
        observer.next(title);
        observer.complete();
      }),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getChildRoute(this.activatedRoute)),
        map(route => route.routeConfig?.title as string)
      )
    );
  }

  private getChildRoute(route: ActivatedRoute) {
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
