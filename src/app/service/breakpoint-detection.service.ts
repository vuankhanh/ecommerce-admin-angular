import { Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointDetectionService {

  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  detection$(){
    return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).pipe(
      map((state: BreakpointState) => state.matches)
    )
  }
}
