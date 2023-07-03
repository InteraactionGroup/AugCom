import { Component, OnInit } from '@angular/core';
import { UsertoolbarService } from '../../services/usertoolbar.service';
import { BoardService } from '../../services/board.service';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { EditionService } from '../../services/edition.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MultilinguismService } from '../../services/multilinguism.service';

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

  constructor(public editionService: EditionService, public indexedDBacess: IndexeddbaccessService,
    public boardService: BoardService, public userToolBarService: UsertoolbarService,
    public multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

  /**
   * delete the sentencedTodDeleteElement, update the database and close the popup panel
   */
  yes() {
    this.boardService.executer();
    this.editionService.selectedElements = [];
    this.editionService.sentencedToBeDeletedElement = [];
    this.indexedDBacess.update();
    this.closePopup();
  }

  /**
   * cancel the deletion of the sentencedTodDeleteElement and close the popup panel
   */
  no() {
    this.editionService.selectedElements = [];
    this.editionService.sentencedToBeDeletedElement = [];
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
    if (this.editionService.sentencedToBeDeletedElement.length === 1) {
      return this.multilinguism.translate('theElement') + ': "' +
        this.boardService.getDefaultLabel(this.editionService.sentencedToBeDeletedElement[0]) + '".\n';
    } else if (this.editionService.sentencedToBeDeletedElement.length >= 1) {
      return this.multilinguism.translate('severalElements') + '\n';
    }
  }
}
