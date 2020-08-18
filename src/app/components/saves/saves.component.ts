import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-saves',
  templateUrl: './saves.component.html',
  styleUrls: ['./saves.component.css'],
  providers: [Ng2ImgMaxService]
})
export class SavesComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService, public boardService: BoardService, public indexeddbaccessService: IndexeddbaccessService) {
  }

  ngOnInit() {
  }

  /*reset save to the "exempleOfBoard" value*/
  reset() {
    indexedDB.deleteDatabase('Saves');
    this.boardService.resetBoard();
    this.indexeddbaccessService.init();
    this.indexeddbaccessService.update();
  }

}
