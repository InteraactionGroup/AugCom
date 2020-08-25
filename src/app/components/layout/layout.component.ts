import {Component, OnInit} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';
import {LayoutService} from '../../services/layout.service';
import {BoardService} from '../../services/board.service';
import {EditionService} from '../../services/edition.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(private boardService: BoardService, public layoutService: LayoutService, public editionService: EditionService) {
  }

  ngOnInit(): void {
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  convertToGridsterItem( item: any ) {
    const convertedItem = item;
    if(item.dragAndResizeEnabled === false) {
      convertedItem.dragEnabled = false;
      convertedItem.resizeEnabled = false;
    }
    return convertedItem;
  }

  getPageBackgroundColorValue(): string{
    const currentPage = this.boardService.board.PageList.find(page => {
      return page.ID === this.boardService.getCurrentFolder()
    });
    if (currentPage !== null && currentPage !== undefined) {
      if (currentPage.BackgroundColor === undefined || currentPage.BackgroundColor === null || currentPage.BackgroundColor === 'default' ){
        return this.getGridBackgroundColorValue();
      } else {
        return currentPage.BackgroundColor;
      }
    } else {
      return this.getGridBackgroundColorValue();
    }
  }

  getGridBackgroundColorValue() : string{
    if (
      this.boardService.board.BackgroundColor === undefined ||
      this.boardService.board.BackgroundColor === null ||
      this.boardService.board.BackgroundColor === 'default' ){
      return 'grey'
    } else {
      return this.boardService.board.BackgroundColor;
    }
  }

}
