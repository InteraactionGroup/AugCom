import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {EditionService} from '../../services/edition.service';
import {FolderGoTo, Page} from '../../types';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeletePageComponent} from '../dialog-delete-page/dialog-delete-page.component';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-delete-page',
  templateUrl: './delete-page.component.html',
  styleUrls: ['./delete-page.component.css']
})
export class DeletePageComponent implements OnInit {

  constructor(public boardService: BoardService,
              public editionService: EditionService,
              public multilinguism: MultilinguismService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  deletePage(){
    this.deleteLink(this.getCurrentPage());
    this.boardService.board.PageList = this.boardService.board.PageList.filter(page => page !== this.getCurrentPage());
    this.boardService.backToPreviousFolder();
  }
  deleteLink(page: Page){
    this.boardService.board.ElementList.forEach(elem =>
    {
      if( (elem.Type as FolderGoTo).GoTo  === page.ID ){
        elem.Type = 'button';
      }
    });
  }

  getCurrentPage(): Page {
    return this.boardService.board.PageList.find(page => {
      return page.ID === this.boardService.getCurrentFolder()
    });
  }

  openDialog(): void{
    this.dialog.open(DialogDeletePageComponent, {
      height: '400px',
      width: '600px'
    });
  }
}
