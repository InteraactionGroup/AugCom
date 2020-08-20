import {Injectable} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';

@Injectable({
  providedIn: 'root',
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
    maxRows: 6
  };

  constructor() {
  }

  setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
    this.options.displayGrid = b ?'always' : 'none';
    this.refresh();
  }

  setCols(cols: number): void {
    this.options.minCols = this.options.maxCols = cols;
    this.refresh();
  }

  setRows(rows: number): void {
    this.options.minRows = this.options.maxRows = rows;
    this.refresh();
  }

  setGap(gap: number): void {
    this.options.margin = gap;
    this.refresh();
  }

  refresh() {
    if (this.options.api !== undefined) {
      this.options.api.optionsChanged();
    }
  }
}
