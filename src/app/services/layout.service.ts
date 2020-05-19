import { Injectable } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { Element } from "../types";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: false,
      stop: (item, gridsterItem, event) => {},
    },
    pushItems: true,
    swapItems: false,
    resizable: {
      enabled: false,
      stop: (item, gridsterItem, event) => {},
    },
  };

  public layout: any[] = [];

  constructor() {}

  public addItem(element: Element): void {
    this.layout.push({
      gridsterItem: {
        cols: 5,
        rows: 10,
        id: element.ElementID,
        x: 0,
        y: 0,
      },
      element: element,
    });
  }

  public setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
    console.log(this.options.draggable.enabled);
  }

  public deleteItem(id: string): void {
    const item = this.layout.find((d) => d.gridsterItem.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
  }
}
