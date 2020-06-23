import { Component, OnInit, Input } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { LayoutService } from "../../services/layout.service";
import { GridElement } from "../../types";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit {
  @Input() elements: GridElement[];

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    if (this.layout.length == 0 && this.elements !== undefined) {
      for (const element of this.elements) this.layoutService.addItem(element);
    }
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  get layout(): any[] {
    return this.layoutService.layout;
  }
}
