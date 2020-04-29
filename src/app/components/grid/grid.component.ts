import { Component, OnInit, NgZone, Input, OnChanges } from "@angular/core";
import { Element } from "../../types";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit, OnChanges {
  @Input() elements: Element[];

  grid: any;
  items: any;

  constructor(
    private zone: NgZone,
    private indexeddbaccessService: IndexeddbaccessService,
    public userToolbarService: UsertoolbarService
  ) {
    Muuri.defaultOptions.dragSortPredicate.action = "swap";
  }

  ngOnInit(): void {
    this.grid = new Muuri(".grid");
    this.indexeddbaccessService.init();
  }

  ngOnChanges(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        this.grid.destroy();
        this.grid = new Muuri(".grid", {
          dragEnabled: this.userToolbarService.edit,
          layoutEasing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        });
      })
    );
  }
}
