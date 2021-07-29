import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {EditionService} from '../../services/edition.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeletePageComponent} from '../dialog-delete-page/dialog-delete-page.component';
import {MultilinguismService} from '../../services/multilinguism.service';
import {LayoutService} from "../../services/layout.service";

@Component({
  selector: 'app-delete-page',
  templateUrl: './delete-page.component.html',
  styleUrls: ['./delete-page.component.css']
})
export class DeletePageComponent implements OnInit {

  constructor(public boardService: BoardService,
              public editionService: EditionService,
              public multilinguism: MultilinguismService,
              public layoutService: LayoutService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    let dialogref = this.dialog.open(DialogDeletePageComponent, {
      height: '400px',
      width: '600px'
    });

    dialogref.afterClosed().subscribe(() => {
      this.layoutService.isPreview = false;
    });
  }
}
