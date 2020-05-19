import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { LayoutService } from "../../services/layout.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";

import { Element } from "../../types";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit {
  @Input() elements: Element[];

  constructor(
    private userToolBarService: UsertoolbarService,
    private layoutService: LayoutService,
    private indexedDBacess: IndexeddbaccessService
  ) {}

  ngOnInit() {
    this.elements.forEach((element) => {
      this.layoutService.addItem(element);
    });
    this.layoutService.setDraggable(this.userToolBarService.edit);
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  get layout(): any[] {
    return this.layoutService.layout;
  }
}
