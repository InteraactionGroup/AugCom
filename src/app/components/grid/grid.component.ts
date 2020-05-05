import { Component, OnInit, Input, AfterViewInit, NgZone } from "@angular/core";
import { Element } from "../../types";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() elements: Element[];

  grid: any;

  constructor(
    public userToolbarService: UsertoolbarService,
    private zone: NgZone
  ) {
    Muuri.defaultOptions.dragSortPredicate.action = "swap";
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.grid = new Muuri(".grid", {
        layoutEasing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        dragEnabled: true,
        dragStartPredicate: (item, e) => this.checkIfEditEnabled(item, e),
      });
    });
  }

  ngAfterViewInit(): void {}

  checkIfEditEnabled(item, e) {
    console.log("check");
    return this.userToolbarService.edit
      ? Muuri.ItemDrag.defaultStartPredicate(item, e)
      : false;
  }
}
