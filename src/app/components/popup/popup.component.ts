import { Component, OnInit } from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {BoardService} from '../../services/board.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {


  questionBegin = 'Êtes-vous sûr de vouloir supprimer l\'élément: ';
  questionEnd = ' ? \n la suppression ne peut pas être défaite.';

  constructor(public indexedDBacess: IndexeddbaccessService, public boardService: BoardService, public userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  yes() {
    this.boardService.executer();
    this.indexedDBacess.update();
    this.closePopup();
  }

  no() {
    this.boardService.elementCondamne = null;
    this.closePopup();
  }

  closePopup() {
    this.userToolBarService.popup = false;
  }
}
