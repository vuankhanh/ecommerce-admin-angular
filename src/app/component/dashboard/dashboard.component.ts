import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../shared/modules/material';
import { BreakpointDetectionService } from '../../service/breakpoint-detection.service';
import { AuthStateService } from '../../service/auth_state.service';
import { RouterEventService } from '../../service/router-event.service';
import { AuthService } from '../../service/api/auth.service';
import { MatAccordion } from '@angular/material/expansion';
import { IJwtDecoded } from '../../shared/interface/user_information.interface';
import { MenuHeaderComponent } from '../../shared/component/menu-header/menu-header.component';
import { Menu } from '../../shared/constant/menu.constant';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,

    MenuHeaderComponent,

    MaterialModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('accordion') accordion?: MatAccordion;
  @ViewChild('userAccordion') userAccordion?: MatAccordion;
  breakpointDetection$: Observable<boolean> = of(false);
  menu = Menu;

  title$ = this.routerEventService.getRouteTitle$();

  private readonly bUserInformation: BehaviorSubject<IJwtDecoded | null> = new BehaviorSubject<IJwtDecoded | null>(null);
  userInformation$ = this.bUserInformation.asObservable();
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly breakpointDetectionService: BreakpointDetectionService,
    private readonly authService: AuthService,
    private readonly authStateService: AuthStateService,
    private readonly routerEventService: RouterEventService,
  ) {
    this.breakpointDetection$ = this.breakpointDetectionService.detection$()
  }

  ngOnInit() {
    const jwtTokenPayload: IJwtDecoded = this.activatedRoute.snapshot.data['user'] as IJwtDecoded;
    this.bUserInformation.next(jwtTokenPayload);
  }

  closeSideMenu() {
    this.accordion?.closeAll();
    this.userAccordion?.closeAll();
  }

  logout() {
    this.authStateService.logout();
  }
}
