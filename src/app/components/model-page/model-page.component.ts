import { Component, OnInit } from '@angular/core';
import {BoardService} from "../../services/board.service";
import {MultilinguismService} from "../../services/multilinguism.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogModelGridComponent} from "../dialog-model-grid/dialog-model-grid.component";

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.css']
})
export class ModelPageComponent implements OnInit {

  constructor(public boardService: BoardService,
              public multilinguism: MultilinguismService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.dialog.open(DialogModelGridComponent, {
      height: '20%',
      width: '30%'
    });
  }
}
