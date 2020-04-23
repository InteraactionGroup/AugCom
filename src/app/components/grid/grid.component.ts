import { Component, OnInit, NgZone, Input } from "@angular/core";
import { Element } from "../../types";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit {
  @Input() dragNdrop: boolean;
  @Input() elements: Element[];

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        let grid = new Muuri(
          ".grid",
          {
            dragEnabled: this.dragNdrop,
            dragSortPredicate: {
              threshold: 20,
              action: "move",
            },
          },
          100
        );
      })
    );
  }
}
