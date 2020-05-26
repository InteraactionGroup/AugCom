import { Injectable } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import {Element, Grid} from '../types';
import { UsertoolbarService } from './usertoolbar.service';
import {element} from 'protractor';

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
    defaultItemCols: 1,
    defaultItemRows: 1,
    displayGrid: 'always',
    minCols: 5,
    minRows: 6,
  };

  public layout: any[] = [];

  constructor() {}

  // tslint:disable-next-line:no-shadowed-variable
  addItem(element: Element): void {
    this.layout.push({
      gridsterItem: {
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
    this.options.minCols = this.options.maxCols = cols;
    this.options.api.optionsChanged();
  }

  setRows(rows: number): void {
    this.options.minRows = this.options.maxRows = rows;
    this.options.api.optionsChanged();
  }

  loadGrid(grid: Grid): void {
  }

}
