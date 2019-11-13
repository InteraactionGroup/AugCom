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


  /**
   * strings for the beginning and end of the popup question
   */
  questionBegin = 'Êtes-vous sûr de vouloir supprimer l\'élément: ';
  questionEnd = ' ? \n la suppression ne peut pas être défaite.';

  constructor(public indexedDBacess: IndexeddbaccessService, public boardService: BoardService, public userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  /**
   * delete the elementCondamne, update the database and close the popup panel
   */
  yes() {
    this.boardService.executer();
    this.indexedDBacess.update();
    this.closePopup();
  }

  /**
   * cancel the deletion of the elementCondamne and close the popu panel
   */
  no() {
    this.boardService.elementCondamne = null;
    this.closePopup();
  }
  /**
   * clsoe the popup panel by setting popup to false
   */
  closePopup() {
    this.userToolBarService.popup = false;
  }
}
