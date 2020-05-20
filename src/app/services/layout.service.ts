import { Injectable } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { Element } from "../types";
import { UsertoolbarService } from "../services/usertoolbar.service";

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

  emptyLayout(): void {
    this.layout = [];
  }

  addItem(element: Element): void {
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

  deleteItem(id: string): void {
    const item = this.layout.find((d) => d.gridsterItem.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
  }

  setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
    this.options.api.optionsChanged();
    // if (this.options.api !== undefined) this.options.api.optionsChanged();
  }
}
