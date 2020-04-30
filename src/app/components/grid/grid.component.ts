import {
  Component,
  OnInit,
  NgZone,
  Input,
  OnChanges,
  DoCheck,
} from "@angular/core";
import { Element } from "../../types";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import * as Muuri from "muuri";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"],
})
export class GridComponent implements OnInit, OnChanges {
  @Input() elements: Element[];

  grid: any;
  grid2: any;
  items: any;

  constructor(
    private zone: NgZone,
    private indexeddbaccessService: IndexeddbaccessService,
    public userToolbarService: UsertoolbarService
  ) {
    Muuri.defaultOptions.dragSortPredicate.action = "swap";
  }

  ngOnInit(): void {
    this.indexeddbaccessService.init();
    this.grid = new Muuri(".grid");
    this.grid2 = this.grid.getElement();
  }

  ngOnChanges(): void {
    this.zone.runOutsideAngular(() =>
      setTimeout(() => {
        this.grid.destroy();
        this.grid = new Muuri(this.grid2, {
          dragEnabled: this.userToolbarService.edit,
          layoutEasing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        });
        this.grid2 = this.grid.getElement();
      })
    );
  }
}
