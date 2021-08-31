import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {Grid, Page} from "../../types";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-dialog-reset-grid',
  templateUrl: './dialog-reset-grid.component.html',
  styleUrls: ['./dialog-reset-grid.component.css']
})
export class DialogResetGridComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              private boardService: BoardService,) { }

  ngOnInit(): void {
  }

  clearBoard(){
    const homePage: Page = new Page();
    homePage.ID = '#HOME';
    homePage.Name = 'Acceuil';
    homePage.ElementIDsList = [];
    homePage.NumberOfCols = 3;
    homePage.NumberOfRows = 3;
    homePage.GapSize = 6;
    this.boardService.board = new Grid('nothing','grid',0,0,[],[],[homePage]);
    this.boardService.updateElementList();
  }

}
