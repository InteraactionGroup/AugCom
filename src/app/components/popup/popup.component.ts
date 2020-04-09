import {Component, OnInit} from '@angular/core';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {BoardService} from '../../services/board.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {EditionService} from '../../services/edition.service';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  providers: [Ng2ImgMaxService]
})
export class PopupComponent implements OnInit {


  /**
   * strings for the beginning and end of the popup question
   */
  questionBegin = 'Vous êtes sur le point de supprimer ';
  questionEnd = 'la suppression ne peut pas être défaite.\n Continuer ?';

  constructor(public editionService: EditionService, public indexedDBacess: IndexeddbaccessService,
              public boardService: BoardService, public userToolBarService: UsertoolbarService) {
  }

  ngOnInit() {
  }

  /**
   * delete the sentencedTodDeleteElement, update the database and close the popup panel
   */
  yes() {
    this.boardService.executer();
    this.editionService.selectedElements = [];
    this.editionService.sentencedTodDeleteElement = [];
    this.indexedDBacess.update();
    this.closePopup();
  }

  /**
   * cancel the deletion of the sentencedTodDeleteElement and close the popup panel
   */
  no() {
    this.editionService.selectedElements = [];
    this.editionService.sentencedTodDeleteElement = [];
    this.closePopup();
  }

  /**
   * close the popup panel by setting popup to false
   */
  closePopup() {
    this.userToolBarService.popup = false;
  }

  /**
   * @return the string value to display for the sentencedToDeleteElements
   */
  getSentencedToDeleteElementStringValue() {
    if (this.editionService.sentencedTodDeleteElement.length === 1) {
      return 'l\'élément: "' + this.boardService.getDefaultLabel(this.editionService.sentencedTodDeleteElement[0]) + '".\n';
    } else if (this.editionService.sentencedTodDeleteElement.length >= 1) {
      return 'plusieurs éléments. \n';
    }
  }
}
