import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { Element } from "../../types";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit, AfterViewInit {
  @Input() elements: Element[];

  constructor(public userToolbarService: UsertoolbarService) {
    Muuri.defaultOptions.dragSortPredicate.action = "swap";
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.doAsyncTask();
  }

  checkIfEditEnabled(item, e) {
    console.log("check");
    return this.userToolbarService.edit
      ? Muuri.ItemDrag.defaultStartPredicate(item, e)
      : false;
  }

  async doAsyncTask(): Promise<any> {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        new Muuri(".grid", {
          layoutEasing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
          dragEnabled: true,
          dragStartPredicate: (item, e) => this.checkIfEditEnabled(item, e),
        });
      }, 1000);
      resolve("grid init");
    });
  }
}
