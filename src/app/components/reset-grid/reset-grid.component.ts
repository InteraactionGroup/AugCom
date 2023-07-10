import { Component, OnInit } from '@angular/core';
import { BoardService } from "../../services/board.service";
import { Grid, Page } from "../../types";
import { DialogResetGridComponent } from "../dialog-reset-grid/dialog-reset-grid.component";
import { MatDialog } from "@angular/material/dialog";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-reset-grid',
  templateUrl: './reset-grid.component.html',
  styleUrls: ['./reset-grid.component.css']
})
export class ResetGridComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public multilinguism: MultilinguismService) {
  }

  ngOnInit(): void {
  }

  /**
   * Opens a dialog to resets the board to an empty state
   */
  openDialog(): void {
    this.dialog.open(DialogResetGridComponent, {
      height: '20%',
      width: '30%'
    });
  }
}
