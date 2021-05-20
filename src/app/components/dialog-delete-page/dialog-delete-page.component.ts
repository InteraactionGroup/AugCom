import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {MatListOption} from '@angular/material/list';

@Component({
  selector: 'app-dialog-delete-page',
  templateUrl: './dialog-delete-page.component.html',
  styleUrls: ['./dialog-delete-page.component.css']
})
export class DialogDeletePageComponent implements OnInit {
  constructor(public boardService: BoardService) {}
  ngOnInit(): void {}

  DeletePages(pages: MatListOption[]){
    console.log('pages.selected',pages);
    console.log('pagelist',this.boardService.board.PageList);
    // this.DeleteLink(this.getCurrentPage());
    this.boardService.board.PageList = this.boardService.board.PageList.filter(page => pages.forEach(pa => {
      console.log('pa.value[0]',pa.value);
      // tslint:disable-next-line:no-unused-expression
      String(pa.value[0]) === page.ID;})
    );
    // this.boardService.backToPreviousFolder();
  }
}
