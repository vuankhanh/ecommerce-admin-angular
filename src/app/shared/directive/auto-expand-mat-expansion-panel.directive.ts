import { Directive, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { TMenu } from '../interface/menu.interface';

@Directive({
  selector: '[appAutoExpand]',
  standalone: true
})
export class AutoExpandMatExpansionPanelDirective implements OnInit {
  @Input() appAutoExpand: TMenu[] | undefined = [];

  constructor(
    private router: Router,
    private expansionPanel: MatExpansionPanel
  ) {}

  ngOnInit() {
    const hasActiveChild = this.appAutoExpand?.some(child => 
      this.router.url.includes(child!.route!)
    );
    
    if (hasActiveChild) {
      this.expansionPanel.open();
    }
  }
}