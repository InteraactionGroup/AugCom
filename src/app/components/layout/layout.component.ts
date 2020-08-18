import {Component, OnInit} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';
import {LayoutService} from '../../services/layout.service';
import {BoardService} from '../../services/board.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(private boardService: BoardService, public layoutService: LayoutService) {
  }

  ngOnInit(): void {
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }
}
