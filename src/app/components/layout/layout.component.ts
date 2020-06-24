import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { LayoutService } from "../../services/layout.service";
import { GridElement } from "../../types";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit, OnChanges {
  @Input() elements: GridElement[];

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    // for (const element of this.elements) this.layoutService.addItem(element);
  }

  ngOnChanges(): void {
    this.layoutService.deleteAll();
    for (const element of this.elements) this.layoutService.addItem(element);
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  get layout(): any[] {
    return this.layoutService.layout;
  }
}
