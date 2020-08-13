import { Injectable } from "@angular/core";
import { GridElement } from "../types";
import { GridsterConfig } from "angular-gridster2";

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: false,
    },
    pushItems: false,
    swapItems: true,
    resizable: {
      enabled: false,
    },
    defaultItemCols: 1,
    defaultItemRows: 1,
    margin: 5,
    minCols: 5,
    minRows: 6,
    maxCols: 5,
    maxRows: 6,
  };

  constructor() {}

  setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
    this.options.api.optionsChanged();
  }

  setCols(cols: number): void {
    this.options.minCols = this.options.maxCols = cols;
    this.options.api.optionsChanged();
  }

  setRows(rows: number): void {
    this.options.minRows = this.options.maxRows = rows;
    this.options.api.optionsChanged();
  }
}
