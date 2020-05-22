import { Component, OnInit, Input } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import { LayoutService } from '../../services/layout.service';

import { Element } from '../../types';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  @Input() elements: Element[];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    if (this.layout.length === 0) {
      this.elements.forEach((element) => {
        this.layoutService.addItem(element);
      });
    }
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  get layout(): any[] {
    return this.layoutService.layout;
  }
}
