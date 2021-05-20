import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {MatListOption} from '@angular/material/list';
import {FolderGoTo, Page} from "../../types";

@Component({
  selector: 'app-dialog-delete-page',
  templateUrl: './dialog-delete-page.component.html',
  styleUrls: ['./dialog-delete-page.component.css']
})
export class DialogDeletePageComponent implements OnInit {
  constructor(public boardService: BoardService) {}
  ngOnInit(): void {}

  DeletePages(pages: MatListOption[]){
    const pagefilter = [];
    pages.forEach(pa => pagefilter.push(String(pa.value)));
    pagefilter.forEach(page => this.DeleteLinks(page));
    this.boardService.board.PageList = this.boardService.board.PageList.filter(page => !pagefilter.includes(page.ID));
  }
  DeleteLinks(page: string){
    this.boardService.board.ElementList.forEach(elem =>
    {
      if( (elem.Type as FolderGoTo).GoTo  === page ){
        elem.Type = 'button';
      }
    });
  }
}
