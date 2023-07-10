import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { LayoutService } from '../../services/layout.service';
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-grid-format-management',
  templateUrl: './grid-format-management.component.html',
  styleUrls: ['./grid-format-management.component.css']
})
export class GridFormatManagementComponent implements OnInit {

  constructor(public boardService: BoardService,
    public layoutService: LayoutService,
    public multilinguismService: MultilinguismService) {
  }

  ngOnInit(): void {
  }

  /**
   * Adds or removes a column from the current board
   */
  onKeyCols(event: any) {
    if (+event.target.value >= 1) {
      this.boardService.board.NumberOfCols = +event.target.value;
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

  /**
   * Adds or removes a row from the current board
   */
  onKeyRows(event: any) {
    if (+event.target.value >= 1) {
      this.boardService.board.NumberOfRows = +event.target.value;
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

  /**
   * Increases or decreases the distance between each row and column of the current board
   */
  onKeyGap(event: any) {
    if (+event.target.value >= 1) {
      this.boardService.board.GapSize = +event.target.value;
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

}
