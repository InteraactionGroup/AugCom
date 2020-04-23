import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.css"],
})
export class TileComponent implements OnInit {
  id: string;
  type: string;
  color: string;
  borderColor: string;

  // element var is  a Element class from types.ts
  @Input() element: any;

  constructor() {
    if (this.element === undefined) {
      this.element = "undefined";
    }
  }

  ngOnInit(): void {}
}
