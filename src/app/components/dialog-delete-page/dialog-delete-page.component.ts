import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {MatListOption} from '@angular/material/list';
import {FolderGoTo, Grid, Page} from '../../types';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-dialog-delete-page',
  templateUrl: './dialog-delete-page.component.html',
  styleUrls: ['./dialog-delete-page.component.css']
})
export class DialogDeletePageComponent implements OnInit {
  constructor(public boardService: BoardService,
              public multilinguism: MultilinguismService) {}
  ngOnInit(): void {}

  deletePages(pages: MatListOption[]){
    const pagefilter = [];
    pages.forEach(pa => pagefilter.push(String(pa.value)));
    pagefilter.forEach(page => this.deleteLinks(page));
    this.boardService.board.PageList = this.boardService.board.PageList.filter(page => !pagefilter.includes(page.ID));
  }
  deleteLinks(page: string){
    this.boardService.board.ElementList.forEach(elem =>
    {
      if( (elem.Type as FolderGoTo).GoTo  === page ){
        elem.Type = 'button';
      }
    });
  }

  preview(page: Page){
    console.log('nom de page', page.Name);
    this.boardService.backHome();
    this.boardService.currentPath = '#HOME.' + page.ID;
    console.log('le path',this.boardService.currentPath)
  }

  displayGrid(){
    const element = document.getElementById('grid');
    element.style.visibility = 'hidden';
  }

  hideGrid() {
    const element = document.getElementById('grid');
    element.style.visibility = 'visible';
  }
}
