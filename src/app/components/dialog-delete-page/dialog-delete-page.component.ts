import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {MatListOption} from '@angular/material/list';
import {FolderGoTo, Page} from '../../types';
import {MultilinguismService} from '../../services/multilinguism.service';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'app-dialog-delete-page',
  templateUrl: './dialog-delete-page.component.html',
  styleUrls: ['./dialog-delete-page.component.css']
})
export class DialogDeletePageComponent implements OnInit {
  constructor(public boardService: BoardService,
              public multilinguism: MultilinguismService,
              public layoutService: LayoutService) {
  }

  pointer = 'none';

  ngOnInit(): void {
  }

  getPageList(){
    return this.boardService.board.PageList.filter(page =>{ return page.ID !== '#HOME'});
  }

  deletePages(pages: MatListOption[]) {
    const pagefilter = [];
    pages.forEach(pa => pagefilter.push(String(pa.value)));
    pagefilter.forEach(page => this.deleteLinks(page));
    this.boardService.board.PageList = this.boardService.board.PageList.filter(page => !pagefilter.includes(page.ID));
  }

  deleteLinks(page: string) {
    this.boardService.board.ElementList.forEach(elem => {
      if ((elem.Type as FolderGoTo).GoTo === page) {
        elem.Type = 'button';
      }
    });
  }

  async preview(page: Page) {
    this.layoutService.isPreview = true;
    this.boardService.currentPath = '#HOME.' + page.ID;
    this.boardService.updateElementList();
    await this.delay(500);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    await this.delay(1000);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
