import { Component, OnInit, Input } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { LayoutService, IComponent } from "../../services/layout.service";
import { Element } from "../../types";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit {
  @Input() elements: Element[];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.elements.forEach((element) => {
      this.layoutService.addItem(element);
    });
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }
  get layout(): GridsterItem[] {
    return this.layoutService.layout;
  }
  get components(): IComponent[] {
    return this.layoutService.components;
  }
  get elementLayout(): any {
    return this.layoutService.elementLayout;
  }
}
