import { Injectable } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import {Element, Grid} from '../types';
import { UsertoolbarService } from './usertoolbar.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: false,
      stop: (item, gridsterItem, event) => {
        console.log('');
      },
    },
    pushItems: true,
    swapItems: false,
    resizable: {
      enabled: false,
      stop: (item, gridsterItem, event) => {
        console.log('');
      },
    },
    // maxCols: 100,
    // maxRows: 100,
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
      element,
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
  }

  setCols(cols: number): void {
    this.options.maxCols = cols;
  }

  setRows(rows: number): void {
    this.options.maxRows = rows;
  }

  loadGrid(grid: Grid): void {
  }

}
