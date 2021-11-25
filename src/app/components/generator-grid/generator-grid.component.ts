import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {Grid, Page} from "../../types";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-generator-grid',
  templateUrl: './generator-grid.component.html',
  styleUrls: ['./generator-grid.component.css']
})
export class GeneratorGridComponent implements OnInit {

  constructor(public configuration: ConfigurationService,
              private boardService: BoardService) {
  }

  ngOnInit(): void {
  }

  clearActualGrid(){
    const homePage: Page = new Page();
    homePage.ID = '#HOME';
    homePage.Name = 'Acceuil';
    homePage.ElementIDsList = [];
    homePage.NumberOfCols = 3;
    homePage.NumberOfRows = 3;
    homePage.GapSize = 6;
    this.boardService.board = new Grid('nothing','Grid',0,0,[],[],[homePage]);
    this.boardService.updateElementList();
  }
}
