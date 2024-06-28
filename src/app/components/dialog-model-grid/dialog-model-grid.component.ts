import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";
import { Grid, Page } from "../../types";
import { BoardService } from "../../services/board.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-dialog-model-grid',
  templateUrl: './dialog-model-grid.component.html',
  styleUrls: ['./dialog-model-grid.component.css']
})
export class DialogModelGridComponent implements OnInit {

  constructor(public boardService: BoardService,
    public multilinguism: MultilinguismService,
    public indexDbAccessService: IndexeddbaccessService) { }

  ngOnInit(): void {
  }

  /**
   * Loads a page depending on the type chosen (default or empty)
   */
  gridModelApplication() {
    if (this.boardService.gridModel === 'default') {
      this.indexDbAccessService.loadDefaultGrid();
    } else if (this.boardService.gridModel === 'empty') {
      const page = new Page();
      page.ID = '#HOME';
      page.Name = 'Accueil';
      page.ElementIDsList = [];
      this.boardService.board = new Grid('newGrid', 'Grid', 6, 6, [], [], [page], [], []);
    }
    this.boardService.updateElementList();
  }

}
