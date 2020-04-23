import { Component, OnInit, NgZone, Input } from "@angular/core";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit {
  @Input() dragNdrop: boolean;

  elements = [];

  constructor(private zone: NgZone) {
    // Test
    for (let i = 0; i < 10; i++) {
      this.elements.push(i);
    }
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        let grid = new Muuri(".grid", {
          dragEnabled: this.dragNdrop,
        });
      })
    );
  }
}
