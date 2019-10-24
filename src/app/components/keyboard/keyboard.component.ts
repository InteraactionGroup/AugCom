import { Component, OnInit } from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {OtherformsService} from '../../services/otherforms.service';
import {BoardService} from '../../services/board.service';
import {Element} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService, public otherFormsService: OtherformsService) { }

  ngOnInit() {
    this.indexeddbaccessService.init();
  }

  clickTriggered(element: Element) {
    if (element.ElementType === 'button') {
      this.historicService.push(element);
      this.historicService.say('' + element.ElementForms[0].DisplayedText);
    } else if (element.ElementType === 'folder') {
      this.historicService.say('' + element.ElementForms[0].DisplayedText);
      this.boardService.currentFolder = element.ElementFolder + element.ElementID;
    } else {
      console.log(element.ElementType);
    }
  }

  edit(element: Element) {
    this.userToolBarService.modif = element;
    this.userToolBarService.ElementListener.next(element);
    this.userToolBarService.add = false;
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
