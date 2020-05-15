import { Injectable, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { UUID } from "angular2-uuid";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: false,
    },
    pushItems: true,
    // swapItems: true,
    resizable: {
      enabled: false,
    },
  };

  public layout: any[] = [];

  constructor() {}

  addItem(element): void {
    this.layout.push({
      gridsterItem: {
        cols: 5,
        id: UUID.UUID(),
        rows: 5,
        x: 0,
        y: 0,
      },
      element: element,
    });
  }

  setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
  }
  // deleteItem(id: string): void {
  //   const item = this.layout.find((d) => d.id === id);
  //   this.layout.splice(this.layout.indexOf(item), 1);
  // }
}
