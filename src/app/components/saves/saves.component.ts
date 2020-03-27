import { Component, OnInit } from '@angular/core';
import {BoardService} from "../../services/board.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-saves',
  templateUrl: './saves.component.html',
  styleUrls: ['./saves.component.css']
})
export class SavesComponent implements OnInit {

  constructor(private boardService: BoardService, private indexeddbaccessService: IndexeddbaccessService) { }

  ngOnInit() {
  }

  reset() {
    indexedDB.deleteDatabase('Saves');
    this.boardService.resetBoard();
    this.indexeddbaccessService.init();
    this.indexeddbaccessService.update();
  }

}
