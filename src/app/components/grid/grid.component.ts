import { Component, OnInit, NgZone, Input } from "@angular/core";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit {
  @Input() enabled: boolean;
  elements = [];

  constructor(private zone: NgZone) {
    for (let i = 0; i < 10; i++) {
      this.elements.push(i);
    }
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        const grid = new Muuri.default(".grid", {
          // dragEnabled: false
          // dragSortPredicate: {
          //   threshold: 20,
          //   action: "move",
          // },
        });
      }, 100)
    );
  }
}
