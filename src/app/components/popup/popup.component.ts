import { Component, OnInit } from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {BoardService} from '../../services/board.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {EditionService} from '../../services/edition.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {


  /**
   * strings for the beginning and end of the popup question
   */
  questionBegin = 'Vous êtes sur le point de supprimer ';
  questionEnd = 'la suppression ne peut pas être défaite.\n Continuer ?';

  constructor(public editionService: EditionService, public indexedDBacess: IndexeddbaccessService,
              public boardService: BoardService, public userToolBarService: UsertoolbarService) { }

  ngOnInit() {
  }

  /**
   * delete the elementCondamne, update the database and close the popup panel
   */
  yes() {
    this.boardService.executer();
    this.editionService.selectedElements = [];
    this.editionService.elementCondamne = [];
    this.indexedDBacess.update();
    this.closePopup();
  }

  /**
   * cancel the deletion of the elementCondamne and close the popu panel
   */
  no() {
    this.editionService.selectedElements = [];
    this.editionService.elementCondamne = [];
    this.closePopup();
  }
  /**
   * clsoe the popup panel by setting popup to false
   */
  closePopup() {
    this.userToolBarService.popup = false;
  }

  getText() {
    if (this.editionService.elementCondamne.length === 1) {
      return 'l\'élément: "' + this.editionService.elementCondamne[0].ElementForms[0].DisplayedText + '".\n';
    } else if (this.editionService.elementCondamne.length >= 1) {
      return 'plusieurs éléments. \n';
    }
  }
}
