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
    this.refresh();
  }

  setDraggable(b: boolean): void {
    this.options.draggable.enabled = b;
    this.options.resizable.enabled = b;
    this.options.displayGrid = b ? 'always' : 'none';
    this.refresh();
  }

  refreshAll(cols, rows, gap) {
    if (this.options.api !== undefined) {
      this.options.minCols = this.options.maxCols = cols;
      this.options.minRows = this.options.maxRows = rows;
      this.options.margin = gap;
      this.options.api.optionsChanged();
    }
  }

  refresh() {
    if (this.options.api !== undefined) {
      this.options.api.optionsChanged();
    }
  }


}
