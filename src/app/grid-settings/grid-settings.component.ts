import {Component, OnInit} from '@angular/core';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.css']
})
export class GridSettingsComponent implements OnInit {
  cols: number;
  rows: number;


  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.cols = this.layoutService.options.minCols;
    this.rows = this.layoutService.options.minRows;
  }


  onKeyCols(event: any) {
      this.cols = +event.target.value;
      this.layoutService.setCols(this.cols);
  }

  onKeyRows(event: any) {
    this.rows = +event.target.value;
    this.layoutService.setRows(this.rows);
  }
}
