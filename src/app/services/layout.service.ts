import { Injectable } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { UUID } from "angular2-uuid";

export interface IComponent {
  id: string;
  elementId: string;
}

@Injectable({
  providedIn: "root",
})
export class LayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: true,
    },
    // pushItems: true,
    swapItems: true,
    resizable: {
      enabled: true,
    },
  };

  public layout: GridsterItem[] = [];
  public components: IComponent[] = [];
  public elementLayout: any[] = [];

  constructor() {}

  addItem(element): void {
    this.layout.push({
      cols: 5,
      id: UUID.UUID(),
      rows: 5,
      x: 0,
      y: 0,
    });
    this.elementLayout.push({
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
  deleteItem(id: string): void {
    const item = this.layout.find((d) => d.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
    const comp = this.components.find((c) => c.id === id);
    this.components.splice(this.components.indexOf(comp), 1);
  }
  getComponentRef(id: string): string {
    const comp = this.components.find((c) => c.id === id);
    return comp ? comp.elementId : null;
  }
}
