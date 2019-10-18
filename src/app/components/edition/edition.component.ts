import { Component, OnInit } from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {EditionService} from '../../services/edition.service';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  constructor(private userToolBar: UsertoolbarService, private dbnaryService: DbnaryService, private editionService: EditionService, private boardService: BoardService) { }

  ngOnInit() {
  }

  close(){
    this.userToolBar.add = false;
    this.userToolBar.modif = false;
  }
}
